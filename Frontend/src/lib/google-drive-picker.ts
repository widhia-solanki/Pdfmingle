const GOOGLE_API_SCRIPT_ID = "google-api-script";
const GOOGLE_IDENTITY_SCRIPT_ID = "google-identity-script";
const GOOGLE_API_SRC = "https://apis.google.com/js/api.js";
const GOOGLE_IDENTITY_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

const EXTENSION_TO_MIME_TYPES: Record<string, string[]> = {
  ".bmp": ["image/bmp"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".gif": ["image/gif"],
  ".jpeg": ["image/jpeg"],
  ".jpg": ["image/jpeg"],
  ".pdf": ["application/pdf"],
  ".png": ["image/png"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".tif": ["image/tiff"],
  ".tiff": ["image/tiff"],
  ".webp": ["image/webp"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

type GooglePickerDocument = {
  id: string;
  mimeType?: string;
  name?: string;
};

let gapiLoadPromise: Promise<void> | null = null;
let gisLoadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    gapi?: {
      load: (
        api: string,
        options:
          | (() => void)
          | {
              callback?: () => void;
              onerror?: () => void;
              ontimeout?: () => void;
              timeout?: number;
            }
      ) => void;
    };
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (error: { type?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
      picker?: {
        Action: { PICKED: string; CANCEL: string };
        DocsView: new (viewId: unknown) => {
          setIncludeFolders: (value: boolean) => unknown;
          setSelectFolderEnabled: (value: boolean) => unknown;
          setMimeTypes: (mimeTypes: string) => unknown;
        };
        Feature: { MULTISELECT_ENABLED: unknown };
        PickerBuilder: new () => {
          setDeveloperKey: (key: string) => unknown;
          setOAuthToken: (token: string) => unknown;
          setAppId: (id: string) => unknown;
          addView: (view: unknown) => unknown;
          setCallback: (callback: (data: { action: string; docs?: GooglePickerDocument[] }) => void) => unknown;
          enableFeature: (feature: unknown) => unknown;
          build: () => { setVisible: (value: boolean) => void };
        };
        ViewId: { DOCS: unknown };
      };
    };
  }
}

const loadScript = (id: string, src: string) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Drive import is only available in the browser."));
      return;
    }

    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google scripts.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google scripts."));
    document.head.appendChild(script);
  });
};

const loadGapi = async () => {
  if (!gapiLoadPromise) {
    gapiLoadPromise = (async () => {
      await loadScript(GOOGLE_API_SCRIPT_ID, GOOGLE_API_SRC);

      await new Promise<void>((resolve, reject) => {
        window.gapi?.load("picker", {
          callback: resolve,
          onerror: () => reject(new Error("Google Picker failed to initialize.")),
          ontimeout: () => reject(new Error("Google Picker initialization timed out.")),
          timeout: 5000,
        });
      });
    })();
  }

  return gapiLoadPromise;
};

const loadGis = async () => {
  if (!gisLoadPromise) {
    gisLoadPromise = loadScript(GOOGLE_IDENTITY_SCRIPT_ID, GOOGLE_IDENTITY_SRC);
  }

  return gisLoadPromise;
};

const getRequiredEnv = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
  const developerKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const appId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID;

  if (!clientId || !developerKey) {
    throw new Error(
      "Google Drive import is not configured. Add NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY."
    );
  }

  return { appId, clientId, developerKey };
};

const requestAccessToken = async (clientId: string) => {
  await loadGis();

  return new Promise<string>((resolve, reject) => {
    const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description || "Google Drive authorization failed."));
          return;
        }

        resolve(response.access_token);
      },
      error_callback: () => {
        reject(new Error("Google Drive authorization was cancelled."));
      },
    });

    if (!tokenClient) {
      reject(new Error("Google Identity Services failed to initialize."));
      return;
    }

    tokenClient.requestAccessToken({ prompt: "consent" });
  });
};

const openPicker = async ({
  appId,
  developerKey,
  mimeTypes,
  multiple,
  oauthToken,
}: {
  appId?: string;
  developerKey: string;
  mimeTypes: string[];
  multiple: boolean;
  oauthToken: string;
}) => {
  await loadGapi();

  return new Promise<GooglePickerDocument[]>((resolve, reject) => {
    const googlePicker = window.google?.picker;
    if (!googlePicker) {
      reject(new Error("Google Picker is not available."));
      return;
    }

    const view: any = new googlePicker.DocsView(googlePicker.ViewId.DOCS);
    view.setIncludeFolders(false);
    view.setSelectFolderEnabled(false);

    if (mimeTypes.length > 0) {
      view.setMimeTypes(mimeTypes.join(","));
    }

    const pickerBuilder: any = new googlePicker.PickerBuilder();
    pickerBuilder.setDeveloperKey(developerKey);
    pickerBuilder.setOAuthToken(oauthToken);
    pickerBuilder.addView(view);
    pickerBuilder.setCallback((data: { action: string; docs?: GooglePickerDocument[] }) => {
      if (data.action === googlePicker.Action.PICKED) {
        resolve(data.docs ?? []);
        return;
      }

      if (data.action === googlePicker.Action.CANCEL) {
        reject(new Error("Google Drive selection was cancelled."));
      }
    });

    if (appId) {
      pickerBuilder.setAppId(appId);
    }

    if (multiple) {
      pickerBuilder.enableFeature(googlePicker.Feature.MULTISELECT_ENABLED);
    }

    pickerBuilder.build().setVisible(true);
  });
};

const downloadDriveFile = async (document: GooglePickerDocument, accessToken: string) => {
  if (!document.id) {
    throw new Error("Google Drive did not return a file id.");
  }

  if (document.mimeType?.startsWith("application/vnd.google-apps.")) {
    throw new Error(`Google-native files like "${document.name ?? "Untitled"}" are not supported yet. Pick a real uploaded file instead.`);
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(document.id)}?alt=media&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to download "${document.name ?? "Google Drive file"}" from Google Drive.`);
  }

  const blob = await response.blob();
  const fileName = document.name ?? `drive-file-${document.id}`;
  const mimeType = blob.type || document.mimeType || "application/octet-stream";

  return new File([blob], fileName, { type: mimeType });
};

export const googleDriveMimeTypesFromAcceptString = (accept: string) => {
  const mimeTypes = new Set<string>();

  for (const rawPart of accept.split(",")) {
    const part = rawPart.trim().toLowerCase();
    if (!part) {
      continue;
    }

    if (part.startsWith(".")) {
      for (const mimeType of EXTENSION_TO_MIME_TYPES[part] ?? []) {
        mimeTypes.add(mimeType);
      }
      continue;
    }

    if (part.includes("/")) {
      mimeTypes.add(part);
    }
  }

  return Array.from(mimeTypes);
};

export const googleDriveMimeTypesFromAcceptedFileTypes = (acceptedFileTypes: { [key: string]: string[] }) => {
  return Array.from(
    new Set(
      Object.keys(acceptedFileTypes).flatMap((mimeType) => {
        if (mimeType.includes("/")) {
          return [mimeType];
        }

        return [];
      })
    )
  );
};

export const importFilesFromGoogleDrive = async ({
  mimeTypes,
  multiple,
}: {
  mimeTypes: string[];
  multiple: boolean;
}) => {
  const { appId, clientId, developerKey } = getRequiredEnv();
  const accessToken = await requestAccessToken(clientId);
  const pickedDocuments = await openPicker({
    appId,
    developerKey,
    mimeTypes,
    multiple,
    oauthToken: accessToken,
  });

  if (pickedDocuments.length === 0) {
    return [];
  }

  return Promise.all(pickedDocuments.map((document) => downloadDriveFile(document, accessToken)));
};

export const preloadGoogleDrivePicker = async () => {
  const { clientId } = getRequiredEnv();
  await Promise.all([loadGapi(), loadGis()]);
  return clientId;
};
