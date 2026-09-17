import { prisma } from '@/server/db';

const ID = 'singleton';

const EDITABLE_FIELDS = [
  'heroEyebrow', 'heroTitle', 'heroAccent', 'heroBody', 'heroImage',
  'journeyTitle', 'journeyBody', 'journeyFromLabel', 'journeyFromImage', 'journeyToLabel', 'journeyToImage',
  'designerName', 'designerTitle', 'designerBio', 'designerImage',
  'sourcingTitle', 'sourcingBody', 'sourcingImage',
  'quote', 'quoteAuthor',
];

// Get the story, creating the default row on first read.
const get = async () => {
  let story = await prisma.brandStory.findUnique({ where: { id: ID } });
  if (!story) story = await prisma.brandStory.create({ data: { id: ID } });
  return story;
};

// Update only the fields provided — same partial-update convention as
// productService.update.
const update = async (data) => {
  const updateData = {};
  for (const field of EDITABLE_FIELDS) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  return prisma.brandStory.upsert({
    where: { id: ID },
    update: updateData,
    create: { id: ID, ...updateData },
  });
};

export { get, update };
