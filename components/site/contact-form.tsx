"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  weddingDate: z.string().optional(),
  venue: z.string().optional(),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "w-full bg-transparent border-b border-border py-3 font-sans text-sm font-light placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-sans text-xs text-destructive pt-1">{error}</p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [successName, setSuccessName] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccessName(values.name);
  }

  if (successName) {
    return (
      <div className="py-12">
        <p className="font-heading text-3xl font-light tracking-tight mb-3">
          Thank you, {successName}!
        </p>
        <p className="font-sans text-sm font-light text-muted-foreground leading-6">
          I'll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Field label="Name *" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Your name"
            className={fieldClass}
          />
        </Field>
        <Field label="Email *" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Field label="Phone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={fieldClass}
          />
        </Field>
        <Field label="Wedding Date" error={errors.weddingDate?.message}>
          <input
            {...register("weddingDate")}
            type="date"
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Venue" error={errors.venue?.message}>
        <input
          {...register("venue")}
          placeholder="Venue name & location"
          className={fieldClass}
        />
      </Field>

      <Field label="Message *" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Tell me about your day..."
          className={`${fieldClass} resize-none`}
        />
      </Field>

      {serverError && (
        <p className="font-sans text-sm text-destructive">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 bg-foreground text-background font-sans text-xs uppercase tracking-[0.2em] px-10 py-4 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="size-3 animate-spin" />}
        Send Inquiry
      </button>
    </form>
  );
}
