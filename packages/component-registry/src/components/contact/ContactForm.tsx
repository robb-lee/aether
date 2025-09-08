'use client';

import React from "react";
import { z } from "zod";
import { form, cta } from "../../ui";
import { EditableElement } from "../shared/EditableElement";

export interface ContactFormProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
}

export const ContactFormPropsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  onSubmit: z.function().optional()
});

export function ContactForm({
  title = "Get in touch",
  subtitle = "Have any questions about your order or feedback about our service? We'd love to hear from you.",
  onSubmit,
}: ContactFormProps) {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formState);
    }
  };

  return (
    <EditableElement id="contact-form-section" data-editable-type="section">
      <section className="max-w-2xl mx-auto p-6 sm:p-10 rounded-[var(--radius)] bg-[color-mix(in oklab,var(--primary)_2%,white)] shadow-[var(--card-shadow)]">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {title}
          </h2>
          <p className="text-[color-mix(in oklab, var(--foreground) 70%, white)]">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className={form.label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formState.name}
              onChange={handleChange}
              className={form.field}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={form.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              className={form.field}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className={form.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              value={formState.message}
              onChange={handleChange}
              className={form.textarea}
              required
            />
          </div>

          <div className="text-right">
            <button type="submit" className={cta.primary}>
              Send message
            </button>
          </div>
        </form>
      </section>
    </EditableElement>
  );
}

export default ContactForm;