"use client";

import { useState } from "react";
import {
  EVENT_TYPES,
  formatEventDateLabel,
  isPastEvent,
  slugify,
  type EventInput,
  type EventItem,
  type EventMode,
} from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { contentApi } from "../api";
import { EditorColumns, EditorShell, useContentDocument, type EditorTab } from "../EditorShell";
import {
  Field,
  RailSection,
  Section,
  SegmentedControl,
  SeoFields,
  SlugField,
  ThemePicker,
  fieldClass,
  textareaClass,
} from "../fields";
import { ImageInput } from "../ImageInput";
import { AgendaEditor, BulletListEditor, ChipListEditor } from "../ListEditors";
import { RichTextEditor } from "../editor/RichTextEditor";
import { BrowserFrame } from "../site/BlogSite";
import { EventBanner, EventCard, EventDetailsPage } from "../site/EventSite";

const MODES: readonly EventMode[] = ["Online", "In person"];

function toInput(event: EventItem): EventInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...input } = event;
  return input;
}

const BLANK_EVENT: EventInput = {
  slug: "",
  title: "",
  tagline: "",
  type: "Workshop",
  mode: "Online",
  location: "",
  startDate: null,
  endDate: null,
  timeLabel: "",
  theme: "indigo",
  coverImage: null,
  aboutHtml: "",
  agenda: [],
  takeaways: [],
  audience: [],
  poster: { ribbon: "", title: "", subtitle: "", badgeText: "", badgeType: "" },
  instructor: { name: "", role: "", bio: "", avatar: null, highlights: [] },
  priceLabel: "100% Free",
  certificateLabel: "Included (Free)",
  metaTitle: null,
  metaDescription: null,
  status: "Draft",
};

function looseSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function EventEditor({ event, basePath, siteUrl }: { event?: EventItem; basePath: string; siteUrl: string }) {
  const [tab, setTab] = useState<EditorTab>("edit");
  const [slugTouched, setSlugTouched] = useState(!!event);

  const { doc, patch, save, saving, savedStatus, savedSlug, hasUnsaved, destroy } = useContentDocument<EventInput, EventItem>({
    initial: event ? toInput(event) : BLANK_EVENT,
    id: event?.id,
    create: (input) => contentApi.createEvent(input),
    update: (id, input) => contentApi.updateEvent(id, input),
    remove: (id) => contentApi.deleteEvent(id),
    editHref: (id) => `${basePath}/${id}`,
    listHref: basePath,
    noun: "Event",
  });

  const siteHost = siteUrl.replace(/^https?:\/\//, "");
  const publicPath = `/events/${doc.slug || slugify(doc.title) || "your-event-url"}`;
  const dateLabel = formatEventDateLabel(doc.startDate, doc.endDate);
  const past = isPastEvent(doc);

  const setPoster = (value: Partial<EventInput["poster"]>) => patch({ poster: { ...doc.poster, ...value } });
  const setInstructor = (value: Partial<EventInput["instructor"]>) =>
    patch({ instructor: { ...doc.instructor, ...value } });

  function setTitle(title: string) {
    patch(slugTouched ? { title } : { title, slug: slugify(title) });
  }

  return (
    <EditorShell
      noun="event"
      listHref={basePath}
      listLabel="Events"
      title={doc.title}
      isNew={!event}
      savedStatus={savedStatus}
      statusNote={savedStatus === "Published" && past ? "Published · past" : null}
      hasUnsaved={hasUnsaved}
      saving={saving}
      liveUrl={event && savedStatus === "Published" ? `${siteUrl}/events/${savedSlug}` : null}
      publicUrl={`${siteUrl}${publicPath}`}
      tab={tab}
      onTabChange={setTab}
      onSave={save}
      onDelete={destroy}
    >
      {tab === "preview" ? (
        <div className="mx-auto max-w-7xl space-y-10 px-5 py-10 md:px-10">
          <div>
            <div className="mb-3 text-xs font-medium text-gray-500">Card on the events page</div>
            <div className="uc-site">
              <EventCard event={doc} siteUrl={siteUrl} />
            </div>
          </div>
          <div>
            <div className="mb-3 text-xs font-medium text-gray-500">Event page</div>
            <BrowserFrame url={`${siteHost}${publicPath}`}>
              <EventDetailsPage event={doc} siteUrl={siteUrl} />
            </BrowserFrame>
          </div>
        </div>
      ) : (
        <EditorColumns
          main={
            <div className="space-y-10">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
                  <span>{doc.type || "Event"}</span>
                  <span>·</span>
                  <span>{doc.mode}</span>
                  {dateLabel && (
                    <>
                      <span>·</span>
                      <span>{dateLabel}</span>
                    </>
                  )}
                </div>
                <textarea
                  value={doc.title}
                  onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
                  placeholder="Event title"
                  aria-label="Title"
                  rows={1}
                  className="field-sizing-content w-full resize-none bg-transparent text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-gray-900 outline-none placeholder:text-gray-300"
                />
                <textarea
                  value={doc.tagline}
                  onChange={(e) => patch({ tagline: e.target.value })}
                  placeholder="One line on what attendees get — shown on the card and the event page."
                  aria-label="Tagline"
                  rows={1}
                  className="field-sizing-content mt-3 w-full resize-none bg-transparent text-lg leading-relaxed text-gray-500 outline-none placeholder:text-gray-300"
                />
              </div>

              <Section title="When & where">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Type">
                    <Input list="event-types" value={doc.type} onChange={(e) => patch({ type: e.target.value })} placeholder="Workshop" className={fieldClass} />
                    <datalist id="event-types">
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type} />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="Format" group>
                    <SegmentedControl value={doc.mode} options={MODES} onChange={(mode) => patch({ mode })} />
                  </Field>
                  <Field label="Starts" group>
                    <DatePicker value={doc.startDate} onChange={(startDate) => patch({ startDate })} placeholder="Pick a date" className={fieldClass} />
                  </Field>
                  <Field label="Ends" group>
                    <DatePicker value={doc.endDate} onChange={(endDate) => patch({ endDate })} placeholder="Same day (optional)" className={fieldClass} />
                  </Field>
                  <Field label="Time">
                    <Input value={doc.timeLabel} onChange={(e) => patch({ timeLabel: e.target.value })} placeholder="6:00 PM IST" className={fieldClass} />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={doc.location}
                      onChange={(e) => patch({ location: e.target.value })}
                      placeholder={doc.mode === "Online" ? "Online · Zoom" : "Bengaluru · HSR Layout"}
                      className={fieldClass}
                    />
                  </Field>
                </div>
                {past && <p className="text-xs text-amber-600">This date has passed — the event shows under past events.</p>}
              </Section>

              <Section title="Card artwork" description="The poster on the events page. A thumbnail in the settings panel replaces it.">
                <div className="uc-site overflow-hidden rounded-xl">
                  <EventBanner event={doc} siteUrl={siteUrl} className="min-h-60" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Colour" group className="sm:col-span-2">
                    <ThemePicker value={doc.theme} onChange={(theme) => patch({ theme })} />
                  </Field>
                  <Field label="Ribbon">
                    <Input value={doc.poster.ribbon} onChange={(e) => setPoster({ ribbon: e.target.value })} placeholder="FOR WORKING PROFESSIONALS" className={fieldClass} />
                  </Field>
                  <Field label="Headline">
                    <Input value={doc.poster.title} onChange={(e) => setPoster({ title: e.target.value })} placeholder={doc.title || "Defaults to the title"} className={fieldClass} />
                  </Field>
                  <Field label="Subtitle" className="sm:col-span-2">
                    <Input value={doc.poster.subtitle} onChange={(e) => setPoster({ subtitle: e.target.value })} placeholder={doc.tagline || "Defaults to the tagline"} className={fieldClass} />
                  </Field>
                  <Field label="Badge">
                    <Input value={doc.poster.badgeText} onChange={(e) => setPoster({ badgeText: e.target.value })} placeholder={doc.mode.toUpperCase()} className={fieldClass} />
                  </Field>
                  <Field label="Badge caption">
                    <Input value={doc.poster.badgeType} onChange={(e) => setPoster({ badgeType: e.target.value })} placeholder={doc.type || "Masterclass"} className={fieldClass} />
                  </Field>
                </div>
              </Section>

              <Section title="About this session">
                <RichTextEditor
                  initialHtml={doc.aboutHtml}
                  onChange={(aboutHtml) => patch({ aboutHtml })}
                  folder="events"
                  minHeight="min-h-[160px]"
                  placeholder="What happens in the session, and why it's worth the time…"
                />
              </Section>

              <Section title="What you'll build & take home" description="Press Enter to add the next one.">
                <BulletListEditor
                  items={doc.takeaways}
                  onChange={(takeaways) => patch({ takeaways })}
                  placeholder="A working AI mini-project you built yourself"
                  addLabel="Add takeaway"
                />
              </Section>

              <Section title="Agenda">
                <AgendaEditor slots={doc.agenda} onChange={(agenda) => patch({ agenda })} />
              </Section>

              <Section title="Who it's for">
                <BulletListEditor
                  items={doc.audience}
                  onChange={(audience) => patch({ audience })}
                  placeholder="Developers who want to ship real agentic workflows"
                  addLabel="Add audience"
                />
              </Section>

              <Section title="Instructor" description="Leave the name empty to hide the instructor on the page.">
                <div className="flex items-start gap-4">
                  <ImageInput value={doc.instructor.avatar} onChange={(avatar) => setInstructor({ avatar })} folder="events" siteUrl={siteUrl} compact />
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Name">
                      <Input value={doc.instructor.name} onChange={(e) => setInstructor({ name: e.target.value })} placeholder="Ankit Kumar" className={fieldClass} />
                    </Field>
                    <Field label="Role">
                      <Input value={doc.instructor.role} onChange={(e) => setInstructor({ role: e.target.value })} placeholder="AI Engineer & Mentor" className={fieldClass} />
                    </Field>
                  </div>
                </div>
                <Field label="Bio">
                  <Textarea value={doc.instructor.bio} onChange={(e) => setInstructor({ bio: e.target.value })} placeholder="A couple of sentences on their background." className={textareaClass} />
                </Field>
                <Field label="Highlights" group hint="Short badges such as “Ex-Tech Lead”.">
                  <ChipListEditor items={doc.instructor.highlights} onChange={(highlights) => setInstructor({ highlights })} placeholder="Add a highlight and press Enter" />
                </Field>
              </Section>
            </div>
          }
          rail={
            <>
              <RailSection title="Publishing">
                <SlugField
                  prefix="/events/"
                  value={doc.slug}
                  onChange={(value) => {
                    setSlugTouched(true);
                    patch({ slug: looseSlug(value) });
                  }}
                  warning={
                    savedStatus === "Published" && event && doc.slug && doc.slug !== savedSlug
                      ? "This event is live — changing its URL breaks existing links."
                      : null
                  }
                />
                <p className="text-xs leading-relaxed text-gray-400">
                  Publishing needs a title, tagline, start date, time and location. Drafts can be saved any time.
                </p>
              </RailSection>

              <RailSection title="Thumbnail">
                <ImageInput
                  value={doc.coverImage}
                  onChange={(coverImage) => patch({ coverImage })}
                  folder="events"
                  siteUrl={siteUrl}
                  emptyLabel="Optional — replaces the artwork"
                />
              </RailSection>

              <RailSection title="Registration card">
                <Field label="Price label">
                  <Input value={doc.priceLabel} onChange={(e) => patch({ priceLabel: e.target.value })} placeholder="100% Free" className={fieldClass} />
                </Field>
                <Field label="Certificate" hint="Leave empty to hide this row.">
                  <Input value={doc.certificateLabel} onChange={(e) => patch({ certificateLabel: e.target.value })} placeholder="Included (Free)" className={fieldClass} />
                </Field>
              </RailSection>

              <RailSection title="Search engine">
                <SeoFields
                  metaTitle={doc.metaTitle || ""}
                  metaDescription={doc.metaDescription || ""}
                  onMetaTitle={(value) => patch({ metaTitle: value || null })}
                  onMetaDescription={(value) => patch({ metaDescription: value || null })}
                  fallbackTitle={doc.title ? `${doc.title} — UpperCurve Events` : ""}
                  fallbackDescription={doc.tagline}
                  url={`${siteHost} › events › ${doc.slug || "…"}`}
                />
              </RailSection>
            </>
          }
        />
      )}
    </EditorShell>
  );
}
