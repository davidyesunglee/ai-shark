import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  HelpCircle, 
  Star,
  CheckCircle,
  Clock,
  RefreshCw,
  Filter,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Feedback {
  id: string;
  email: string;
  name: string | null;
  feedbackType: string;
  subject: string | null;
  message: string;
  rating: number | null;
  assessmentId: string | null;
  createdAt: string;
  resolved: boolean;
}

const feedbackTypeIcons: Record<string, React.ReactNode> = {
  general: <MessageSquare className="h-4 w-4" aria-hidden="true" />,
  bug: <Bug className="h-4 w-4" aria-hidden="true" />,
  feature: <Lightbulb className="h-4 w-4" aria-hidden="true" />,
  support: <HelpCircle className="h-4 w-4" aria-hidden="true" />,
  satisfaction: <Star className="h-4 w-4" aria-hidden="true" />,
};

const feedbackTypeLabels: Record<string, string> = {
  general: "General",
  bug: "Bug Report",
  feature: "Feature Request",
  support: "Support",
  satisfaction: "Satisfaction Survey",
};

export default function AdminFeedbackPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const { data: feedback = [], isLoading, refetch, isRefetching } = useQuery<Feedback[]>({
    queryKey: ["/api/admin/feedback"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/feedback", undefined, { "x-admin-key": adminKey });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, resolved }: { id: string; resolved: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/feedback/${id}`, { resolved }, { "x-admin-key": adminKey });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feedback"] });
      toast({ title: "Feedback updated" });
    },
  });

  const handleLogin = () => {
    if (adminKey.trim()) {
      setIsAuthenticated(true);
    }
  };

  const filteredFeedback = feedback.filter((f) => {
    if (filterType !== "all" && f.feedbackType !== filterType) return false;
    if (filterStatus === "resolved" && !f.resolved) return false;
    if (filterStatus === "pending" && f.resolved) return false;
    return true;
  });

  const stats = {
    total: feedback.length,
    pending: feedback.filter(f => !f.resolved).length,
    resolved: feedback.filter(f => f.resolved).length,
    avgRating: feedback.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / 
               Math.max(1, feedback.filter(f => f.rating).length),
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" aria-hidden="true" />
                Admin Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                data-testid="input-admin-key"
              />
              <Button onClick={handleLogin} className="w-full" data-testid="button-admin-login">
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold" data-testid="text-admin-title">
            Customer Feedback Monitor
          </h1>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isRefetching}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Feedback</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-type">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug Reports</SelectItem>
                  <SelectItem value="feature">Feature Requests</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="satisfaction">Satisfaction</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">
                Showing {filteredFeedback.length} of {feedback.length} entries
              </span>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFeedback.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">No feedback entries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <Card key={item.id} data-testid={`card-feedback-${item.id}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={item.resolved ? "secondary" : "default"}>
                          {feedbackTypeIcons[item.feedbackType]}
                          <span className="ml-1">{feedbackTypeLabels[item.feedbackType] || item.feedbackType}</span>
                        </Badge>
                        {item.rating && (
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                            {item.rating}/5
                          </Badge>
                        )}
                        <Badge variant={item.resolved ? "secondary" : "outline"}>
                          {item.resolved ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                              Resolved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                      <h3 className="font-medium">{item.subject || "No subject"}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        From: {item.name || "Anonymous"} ({item.email})
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={item.resolved ? "outline" : "default"}
                        onClick={() => updateMutation.mutate({ id: item.id, resolved: !item.resolved })}
                        disabled={updateMutation.isPending}
                        data-testid={`button-toggle-resolved-${item.id}`}
                      >
                        {item.resolved ? "Reopen" : "Mark Resolved"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          Auto-refreshing every 10 seconds
        </p>
      </main>
    </div>
  );
}
