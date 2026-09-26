import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, Send, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SatisfactionSurveyProps {
  assessmentId: string;
  userEmail?: string;
}

export function SatisfactionSurvey({ assessmentId, userEmail }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const submitSurvey = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/feedback", {
        email: userEmail || "anonymous@user.com",
        feedbackType: "satisfaction",
        subject: `Assessment Rating: ${rating}/5`,
        message: comment || `Rating: ${rating}/5 stars`,
        rating,
        assessmentId,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve our service.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (dismissed || submitted) {
    if (submitted) {
      return (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <ThumbsUp className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground" role="status">Thanks for your feedback!</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card data-testid="card-satisfaction-survey" role="region" aria-label="Satisfaction survey">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">How was your experience?</CardTitle>
            <CardDescription>Help us improve by rating this assessment</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss survey"
            data-testid="button-dismiss-survey"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <fieldset>
          <legend className="sr-only">Rate your experience from 1 to 5 stars</legend>
          <div className="flex justify-center gap-2" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                aria-pressed={rating === star}
                data-testid={`button-star-${star}`}
              >
                <Star
                  className={`h-8 w-8 ${
                    rating && star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </fieldset>

        {rating && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="survey-comment">Additional comments (optional)</Label>
              <Textarea
                id="survey-comment"
                placeholder="Any additional comments?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
                data-testid="input-survey-comment"
              />
            </div>
            <Button
              onClick={() => submitSurvey.mutate()}
              disabled={submitSurvey.isPending}
              className="w-full"
              data-testid="button-submit-survey"
            >
              {submitSurvey.isPending ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
