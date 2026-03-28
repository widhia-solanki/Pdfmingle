import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  Database,
  Download,
  Loader2,
  LogOut,
  RefreshCcw,
  Rows3,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type SortOrder = "latest" | "oldest";

interface FeedbackEntry {
  id: string;
  comment: string;
  emoji: string;
  page: string;
  rating: number | null;
  timestampMs: number | null;
  userId: string;
}

interface AdminFeedbackDashboardProps {
  onLogout: () => void;
  onSessionExpired: (message?: string) => void;
}

const formatTimestamp = (timestampMs: number | null) => {
  if (!timestampMs) {
    return "Pending";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestampMs);
};

const fetchFeedbackDocuments = async (): Promise<FeedbackEntry[]> => {
  const response = await fetch("/api/admin/feedback", {
    credentials: "include",
  });
  const payload = (await response.json()) as { error?: string; feedback?: FeedbackEntry[] };

  if (response.status === 401) {
    throw new Error("unauthorized");
  }

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not load feedback.");
  }

  return Array.isArray(payload.feedback) ? payload.feedback : [];
};

const toCsvValue = (value: string | number | null) => {
  const normalized = value === null ? "" : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
};

export const AdminFeedbackDashboard = ({
  onLogout,
  onSessionExpired,
}: AdminFeedbackDashboardProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        if (loadError instanceof Error && loadError.message === "unauthorized") {
          onSessionExpired("Your admin session expired. Please log in again.");
          return;
        }

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
  }, [onSessionExpired, toast]);

  const pageOptions = useMemo(() => {
    return Array.from(new Set(feedback.map((entry) => entry.page).filter(Boolean))).sort(
      (left, right) => left.localeCompare(right)
    );
  }, [feedback]);

  const filteredFeedback = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return feedback.filter((entry) => {
      const matchesQuery =
        !normalizedQuery ||
        entry.userId.toLowerCase().includes(normalizedQuery) ||
        entry.page.toLowerCase().includes(normalizedQuery) ||
        entry.comment.toLowerCase().includes(normalizedQuery);
      const matchesRating = ratingFilter === "all" || String(entry.rating ?? "") === ratingFilter;
      const matchesPage = pageFilter === "all" || entry.page === pageFilter;

      return matchesQuery && matchesRating && matchesPage;
    });
  }, [feedback, pageFilter, ratingFilter, searchQuery]);

  const sortedFeedback = useMemo(() => {
    return [...filteredFeedback].sort((left, right) => {
      const difference = (left.timestampMs ?? 0) - (right.timestampMs ?? 0);
      return sortOrder === "latest" ? -difference : difference;
    });
  }, [filteredFeedback, sortOrder]);

  const feedbackWithComments = feedback.filter((entry) => entry.comment.trim().length > 0).length;

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const entries = await fetchFeedbackDocuments();
      setFeedback(entries);
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === "unauthorized") {
        onSessionExpired("Your admin session expired. Please log in again.");
        return;
      }

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

  const handleExport = () => {
    if (!sortedFeedback.length) {
      toast({
        title: "Nothing to export",
        description: "There are no feedback rows matching the current filters.",
      });
      return;
    }

    const header = ["User ID", "Rating", "Emoji", "Comment", "Page", "Timestamp"];
    const rows = sortedFeedback.map((entry) => [
      entry.userId,
      entry.rating,
      entry.emoji,
      entry.comment,
      entry.page,
      formatTimestamp(entry.timestampMs),
    ]);
    const csv = [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `pdfmingle-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const handleDelete = async (entry: FeedbackEntry) => {
    const shouldDelete = window.confirm("Delete this feedback entry permanently?");

    if (!shouldDelete) {
      return;
    }

    setDeletingId(entry.id);

    try {
      const response = await fetch(`/api/admin/feedback/${entry.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = (await response.json()) as { error?: string };

      if (response.status === 401) {
        onSessionExpired("Your admin session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete feedback.");
      }

      setFeedback((current) => current.filter((item) => item.id !== entry.id));
      toast({
        title: "Feedback deleted",
        description: "The feedback entry was removed from Firestore.",
      });
    } catch (deleteError) {
      console.error("Error deleting feedback:", deleteError);
      toast({
        title: "Delete failed",
        description:
          deleteError instanceof Error ? deleteError.message : "Could not delete the feedback entry.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRatingFilter("all");
    setPageFilter("all");
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
                Secure admin view of every document in the Firestore <code>feedback</code> collection.
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
            <Button type="button" variant="outline" onClick={handleExport} disabled={isLoading}>
              <Download className="h-4 w-4" />
              Export CSV
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
            Search, filter, export, and delete feedback while keeping Firestore access on the server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-[1.5fr_0.7fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by user ID, page, or comment"
                className="pl-10"
              />
            </div>

            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All ratings</option>
              <option value="5">5 only</option>
              <option value="4">4 only</option>
              <option value="3">3 only</option>
              <option value="2">2 only</option>
              <option value="1">1 only</option>
            </select>

            <select
              value={pageFilter}
              onChange={(event) => setPageFilter(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All pages</option>
              {pageOptions.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>

            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>

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
                <p className="font-medium text-foreground">No matching feedback</p>
                <p className="text-sm text-muted-foreground">Try adjusting the search query or active filters.</p>
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
                      <TableHead className="text-right">Actions</TableHead>
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
                          {formatTimestamp(entry.timestampMs)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(entry)}
                            disabled={deletingId === entry.id}
                          >
                            {deletingId === entry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
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
                          <p className="mt-1 text-foreground">{formatTimestamp(entry.timestampMs)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-center text-destructive hover:text-destructive"
                        onClick={() => handleDelete(entry)}
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
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
