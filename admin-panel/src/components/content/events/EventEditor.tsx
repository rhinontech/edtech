"use client";

import { useState } from "react";
import { CalendarDays, CheckCheck, Clock3, Image as ImageIcon, Info, ListChecks, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { EditorShell, useContentDocument, type EditorTab } from "../EditorShell";
import {
  Field,
  RailCard,
  SectionCard,
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
      statusNote={savedStatus === "Published" && past ? "Published · Past" : null}
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
        <div className="mx-auto max-w-7xl space-y-10">
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Card on /events</div>
            <div className="uc-site">
              <EventCard event={doc} siteUrl={siteUrl} />
            </div>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Event page</div>
            <BrowserFrame url={`${siteHost}${publicPath}`}>
              <EventDetailsPage event={doc} siteUrl={siteUrl} />
            </BrowserFrame>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <SectionCard title="Event details" description="The basics shown on the card and at the top of the page." icon={<Info className="size-5" />}>
              <Field label="Title">
                <Input
                  value={doc.title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Building with AI Tools"
                  className={cn(fieldClass, "h-12 text-lg font-black tracking-tight")}
                />
              </Field>
              <Field label="Tagline">
                <Textarea
                  value={doc.tagline}
                  onChange={(e) => patch({ tagline: e.target.value })}
                  placeholder="A hands-on workshop: build a working AI-powered mini-project in two hours and take it home."
                  className={cn(textareaClass, "min-h-20")}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Type">
                  <Input
                    list="event-types"
                    value={doc.type}
                    onChange={(e) => patch({ type: e.target.value })}
                    placeholder="Workshop"
                    className={fieldClass}
                  />
                  <datalist id="event-types">
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Format" group>
                  <div className="flex h-11 items-center">
                    <SegmentedControl value={doc.mode} options={MODES} onChange={(mode) => patch({ mode })} />
                  </div>
                </Field>
              </div>
              <Field label="Location" hint="Shown as the event's “Mode”, e.g. the platform or the venue.">
                <Input
                  value={doc.location}
                  onChange={(e) => patch({ location: e.target.value })}
                  placeholder={doc.mode === "Online" ? "Online · Zoom" : "Bengaluru · HSR Layout"}
                  className={fieldClass}
                />
              </Field>
            </SectionCard>

            <SectionCard title="Date & time" icon={<CalendarDays className="size-5" />}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Starts" group>
                  <DatePicker
                    value={doc.startDate}
                    onChange={(startDate) => patch({ startDate })}
                    placeholder="Pick a date"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Ends" group hint="Only for multi-day events.">
                  <DatePicker
                    value={doc.endDate}
                    onChange={(endDate) => patch({ endDate })}
                    placeholder="Same day"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Time">
                  <Input
                    value={doc.timeLabel}
                    onChange={(e) => patch({ timeLabel: e.target.value })}
                    placeholder="6:00 PM IST"
                    className={fieldClass}
                  />
                </Field>
              </div>
              {(dateLabel || doc.timeLabel) && (
                <p className="text-xs font-semibold text-gray-500">
                  Shows as <span className="rounded-md bg-blue-50 px-2 py-1 font-bold text-[#0066FF]">{[dateLabel, doc.timeLabel].filter(Boolean).join(" · ")}</span>
                  {past && <span className="ml-2 text-amber-600">This date has passed.</span>}
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Card artwork"
              description="The poster on the events list. Upload a thumbnail in the sidebar to use an image instead."
              icon={<ImageIcon className="size-5" />}
            >
              <div className="uc-site overflow-hidden rounded-2xl">
                <EventBanner event={doc} siteUrl={siteUrl} className="min-h-[250px]" />
              </div>
              <Field label="Colour" group>
                <ThemePicker value={doc.theme} onChange={(theme) => patch({ theme })} />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Ribbon">
                  <Input value={doc.poster.ribbon} onChange={(e) => setPoster({ ribbon: e.target.value })} placeholder="FOR WORKING PROFESSIONALS" className={fieldClass} />
                </Field>
                <Field label="Poster headline">
                  <Input value={doc.poster.title} onChange={(e) => setPoster({ title: e.target.value })} placeholder={doc.title || "Defaults to the title"} className={fieldClass} />
                </Field>
                <Field label="Poster subtitle" className="md:col-span-2">
                  <Input value={doc.poster.subtitle} onChange={(e) => setPoster({ subtitle: e.target.value })} placeholder={doc.tagline || "Defaults to the tagline"} className={fieldClass} />
                </Field>
                <Field label="Badge">
                  <Input value={doc.poster.badgeText} onChange={(e) => setPoster({ badgeText: e.target.value })} placeholder={doc.mode.toUpperCase()} className={fieldClass} />
                </Field>
                <Field label="Badge caption">
                  <Input value={doc.poster.badgeType} onChange={(e) => setPoster({ badgeType: e.target.value })} placeholder={doc.type || "Masterclass"} className={fieldClass} />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="What you'll build & take home" description="Press Enter to add the next one." icon={<CheckCheck className="size-5" />}>
              <BulletListEditor
                items={doc.takeaways}
                onChange={(takeaways) => patch({ takeaways })}
                placeholder="A working AI mini-project you built yourself"
                addLabel="Add takeaway"
              />
            </SectionCard>

            <SectionCard title="Session agenda & schedule" icon={<Clock3 className="size-5" />}>
              <AgendaEditor slots={doc.agenda} onChange={(agenda) => patch({ agenda })} />
            </SectionCard>

            <div className="space-y-3">
              <div className="px-1">
                <h2 className="text-lg font-black tracking-tight text-gray-900">About this session</h2>
                <p className="text-xs font-medium text-gray-500">The long description on the event page.</p>
              </div>
              <RichTextEditor
                initialHtml={doc.aboutHtml}
                onChange={(aboutHtml) => patch({ aboutHtml })}
                folder="events"
                minHeight="min-h-[220px]"
                placeholder="What happens in the session, and why it's worth the time…"
              />
            </div>

            <SectionCard title="Who is this session for?" icon={<ListChecks className="size-5" />}>
              <BulletListEditor
                items={doc.audience}
                onChange={(audience) => patch({ audience })}
                placeholder="Developers who want to ship real agentic workflows"
                addLabel="Add audience"
                bullet="•"
              />
            </SectionCard>

            <SectionCard title="Instructor" description="Leave the name empty to hide the instructor sections." icon={<UserRound className="size-5" />}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="shrink-0">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Photo</div>
                  <ImageInput
                    value={doc.instructor.avatar}
                    onChange={(avatar) => setInstructor({ avatar })}
                    folder="events"
                    siteUrl={siteUrl}
                    compact
                  />
                </div>
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Name">
                    <Input value={doc.instructor.name} onChange={(e) => setInstructor({ name: e.target.value })} placeholder="Ankit Kumar" className={fieldClass} />
                  </Field>
                  <Field label="Role">
                    <Input value={doc.instructor.role} onChange={(e) => setInstructor({ role: e.target.value })} placeholder="AI Engineer & Mentor" className={fieldClass} />
                  </Field>
                </div>
              </div>
              <Field label="Bio">
                <Textarea
                  value={doc.instructor.bio}
                  onChange={(e) => setInstructor({ bio: e.target.value })}
                  placeholder="A couple of sentences on their background."
                  className={textareaClass}
                />
              </Field>
              <Field label="Highlights" group hint="Short badges, e.g. “Ex-Tech Lead”. Press Enter after each.">
                <ChipListEditor
                  items={doc.instructor.highlights}
                  onChange={(highlights) => setInstructor({ highlights })}
                  placeholder="2,000+ Mentees"
                />
              </Field>
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <RailCard title="Publishing">
              <SlugField
                prefix="/events/"
                value={doc.slug}
                onChange={(value) => {
                  setSlugTouched(true);
                  patch({ slug: looseSlug(value) });
                }}
                warning={
                  savedStatus === "Published" && event && doc.slug && doc.slug !== savedSlug
                    ? "This event is live — changing its URL breaks existing links to it."
                    : null
                }
              />
              <p className="text-xs font-medium leading-relaxed text-gray-400">
                Publishing needs a title, tagline, start date, time and location. Drafts can be saved at any point.
              </p>
            </RailCard>

            <RailCard title="Thumbnail">
              <ImageInput
                value={doc.coverImage}
                onChange={(coverImage) => patch({ coverImage })}
                folder="events"
                siteUrl={siteUrl}
                emptyLabel="Optional — replaces the generated artwork"
              />
            </RailCard>

            <RailCard title="Registration card">
              <Field label="Price label">
                <Input value={doc.priceLabel} onChange={(e) => patch({ priceLabel: e.target.value })} placeholder="100% Free" className={fieldClass} />
              </Field>
              <Field label="Certificate" hint="Leave empty to hide the row.">
                <Input value={doc.certificateLabel} onChange={(e) => patch({ certificateLabel: e.target.value })} placeholder="Included (Free)" className={fieldClass} />
              </Field>
            </RailCard>

            <RailCard title="SEO">
              <SeoFields
                metaTitle={doc.metaTitle || ""}
                metaDescription={doc.metaDescription || ""}
                onMetaTitle={(value) => patch({ metaTitle: value || null })}
                onMetaDescription={(value) => patch({ metaDescription: value || null })}
                fallbackTitle={doc.title ? `${doc.title} — UpperCurve Events` : ""}
                fallbackDescription={doc.tagline}
                url={`${siteHost} › events › ${doc.slug || "…"}`}
              />
            </RailCard>
          </aside>
        </div>
      )}
    </EditorShell>
  );
}
