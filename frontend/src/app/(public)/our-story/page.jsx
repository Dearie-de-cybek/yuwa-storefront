import OurStory from '@/views/story/OurStory';
import * as brandStoryService from '@/server/services/brandStoryService';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const story = await brandStoryService.get();
  return {
    title: `${story.heroTitle} ${story.heroAccent} · YUWA`,
    description: story.heroBody,
  };
}

export default async function Page() {
  const story = await brandStoryService.get();
  return <OurStory story={story} />;
}
