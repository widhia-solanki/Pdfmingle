import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { ArrowDownUp, Database, Loader2, LogOut, RefreshCcw, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";

type SortOrder = "latest" | "oldest";

type FeedbackTimestamp =
  | Timestamp
  | Date
  | {
      seconds?: number;
      nanoseconds?: number;
    }
  | null
  | undefined;

interface FeedbackEntry {
  id: string;
  comment: string;
  emoji: string;
  page: string;
  rating: number | null;
  timestamp: FeedbackTimestamp;
  userId: string;
}

interface FirestoreFeedbackDocument {
  comment?: string;
  emoji?: string;
  page?: string;
  rating?: number;
  timestamp?: FeedbackTimestamp;
  userId?: string;
}

interface AdminFeedbackDashboardProps {
  onLogout: () => void;
}

const getTimestampValue = (timestamp: FeedbackTimestamp) => {
  if (!timestamp) {
    return 0;
  }

  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis();
  }

  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }

  if (typeof timestamp === "object" && typeof timestamp.seconds === "number") {
    return timestamp.seconds * 1000;
  }

  return 0;
};

const formatTimestamp = (timestamp: FeedbackTimestamp) => {
  const timestampValue = getTimestampValue(timestamp);

  if (!timestampValue) {
    return "Pending";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestampValue);
};

const fetchFeedbackDocuments = async (): Promise<FeedbackEntry[]> => {
  const snapshot = await getDocs(collection(db, "feedback"));

  return snapshot.docs.map((document) => {
    const data = document.data() as FirestoreFeedbackDocument;

    return {
      id: document.id,
      comment: typeof data.comment === "string" ? data.comment : "",
      emoji: typeof data.emoji === "string" ? data.emoji : "N/A",
      page: typeof data.page === "string" ? data.page : "Unknown",
      rating: typeof data.rating === "number" ? data.rating : null,
      timestamp: data.timestamp ?? null,
      userId: typeof data.userId === "string" ? data.userId : "anonymous",
    };
  });
};

export const AdminFeedbackDashboard = ({ onLogout }: AdminFeedbackDashboardProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  useEffect(() => {
    let isMounted = true;

    const loadFeedback = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const entries = await fetchFeedbackDocuments();

        if (isMounted) {
          setFeedback(entries);
        }
      } catch (loadError) {
        console.error("Error fetching feedback:", loadError);

        if (isMounted) {
          setError("Could not load feedback right now.");
          toast({
            title: "Load failed",
            description: "Feedback could not be fetched from Firestore.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFeedback();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const sortedFeedback = [...feedback].sort((left, right) => {
    const difference = getTimestampValue(left.timestamp) - getTimestampValue(right.timestamp);
    return sortOrder === "latest" ? -difference : difference;
  });

  const feedbackWithComments = feedback.filter((entry) => entry.comment.trim().length > 0).length;

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const entries = await fetchFeedbackDocuments();
      setFeedback(entries);
    } catch (loadError) {
      console.error("Error refreshing feedback:", loadError);
      setError("Could not refresh feedback right now.");
      toast({
        title: "Refresh failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl text-foreground">Feedback Dashboard</CardTitle>
              <CardDescription>
                Read-only view of every document in the Firestore <code>feedback</code> collection.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSortOrder((current) => (current === "latest" ? "oldest" : "latest"))}
            >
              <ArrowDownUp className="h-4 w-4" />
              {sortOrder === "latest" ? "Latest first" : "Oldest first"}
            </Button>
            <Button type="button" variant="outline" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button type="button" variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Total entries</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{feedback.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Comments left</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{feedbackWithComments}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Sort order</p>
            <p className="mt-2 text-3xl font-semibold capitalize text-foreground">{sortOrder}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Feedback Entries</CardTitle>
          <CardDescription>
            User ID, rating, comment, source page, and submission time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Loading feedback</p>
                <p className="text-sm text-muted-foreground">Fetching the latest feedback documents from Firestore.</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-8 text-center">
              <p className="font-medium text-destructive">{error}</p>
            </div>
          ) : sortedFeedback.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 text-center">
              <Rows3 className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">No feedback yet</p>
                <p className="text-sm text-muted-foreground">Feedback submissions will appear here after users respond.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFeedback.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="max-w-[220px] break-all font-mono text-xs text-muted-foreground">
                          {entry.userId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{entry.emoji}</span>
                            <span className="text-sm text-muted-foreground">
                              {entry.rating ? `${entry.rating}/5` : "No score"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md text-sm text-foreground">
                          {entry.comment.trim() ? entry.comment : "No comment"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{entry.page}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-4 md:hidden">
                {sortedFeedback.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">User ID</p>
                        <p className="mt-1 break-all font-mono text-xs text-foreground">{entry.userId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">{entry.emoji}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.rating ? `${entry.rating}/5` : "No score"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Comment</p>
                        <p className="mt-1 text-sm text-foreground">{entry.comment.trim() ? entry.comment : "No comment"}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Page</p>
                          <p className="mt-1 text-foreground">{entry.page}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Timestamp</p>
                          <p className="mt-1 text-foreground">{formatTimestamp(entry.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
