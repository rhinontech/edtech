require("dotenv").config();

const { Blog, Event, sequelize } = require("../models");
const { richText } = require("../utils/content");
const data = require("./data/landingContent.json");

// One-off import of the blogs and events that were hardcoded in the
// uppercurve site (blogData.ts / eventsData.ts) so nothing is lost when the
// site switches to /api/public. Safe to re-run: existing slugs are skipped,
// so edits made in the admin panel are never overwritten.
async function seedLandingContent() {
  const results = { blogs: 0, events: 0, skipped: 0 };

  for (const blog of data.blogs) {
    if (await Blog.findOne({ where: { slug: blog.slug } })) {
      results.skipped += 1;
      continue;
    }
    await Blog.create({ ...blog, contentHtml: richText(blog.contentHtml) });
    results.blogs += 1;
  }

  for (const event of data.events) {
    if (await Event.findOne({ where: { slug: event.slug } })) {
      results.skipped += 1;
      continue;
    }
    await Event.create({ ...event, aboutHtml: richText(event.aboutHtml) });
    results.events += 1;
  }

  console.log(
    `Imported ${results.blogs} blog post(s) and ${results.events} event(s); ` +
      `skipped ${results.skipped} that already exist.`
  );
}

if (require.main === module) {
  seedLandingContent()
    .then(() => sequelize.close())
    .catch((err) => {
      console.error("Failed to import landing content:", err.message);
      process.exitCode = 1;
      return sequelize.close();
    });
}

module.exports = seedLandingContent;
