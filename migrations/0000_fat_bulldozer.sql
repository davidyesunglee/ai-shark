CREATE TABLE "assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_name" text NOT NULL,
	"file_name" text NOT NULL,
	"file_content" text,
	"upload_date" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'analyzing' NOT NULL,
	"overall_score" integer,
	"executive_summary" text,
	"criteria" jsonb,
	"strengths" jsonb,
	"weaknesses" jsonb,
	"recommendations" jsonb
);
--> statement-breakpoint
CREATE TABLE "billing_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_registration_id" varchar NOT NULL,
	"stripe_customer_id" varchar,
	"current_tier" text DEFAULT 'free' NOT NULL,
	"active_subscription_id" varchar,
	"active_price_id" varchar,
	"credits_remaining" integer DEFAULT 0 NOT NULL,
	"credit_window_start" timestamp,
	"last_payment_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "billing_profiles_user_registration_id_unique" UNIQUE("user_registration_id")
);
--> statement-breakpoint
CREATE TABLE "credit_ledger" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_registration_id" varchar NOT NULL,
	"assessment_id" varchar,
	"delta" integer NOT NULL,
	"reason" text NOT NULL,
	"balance_after" integer NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_registration_id" varchar NOT NULL,
	"stripe_payment_intent_id" varchar,
	"stripe_checkout_session_id" varchar,
	"stripe_invoice_id" varchar,
	"price_id" varchar,
	"amount" integer NOT NULL,
	"currency" varchar DEFAULT 'usd' NOT NULL,
	"tax_amount" integer,
	"tier" text,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"emailed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_registrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"street_address" text NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
	"country" varchar DEFAULT 'United States' NOT NULL,
	"company_name" varchar,
	"job_title" varchar,
	"industry" varchar,
	"company_size" varchar,
	"how_did_you_hear" varchar,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"emailed_at" timestamp,
	CONSTRAINT "user_registrations_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"email_verified" boolean DEFAULT false,
	"email_verified_at" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");
