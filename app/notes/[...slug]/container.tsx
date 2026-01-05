import { notFound } from 'next/navigation';
import { Container } from '@/components/composites/container';
import { getNoteBySlug } from '@/lib/notes';
import { NotesPostPresenter } from './presenter';

interface NotesPostContainerProps {
  slug: string[];
}

export async function NotesPostContainer({ slug }: NotesPostContainerProps) {
  try {
    const note = await getNoteBySlug(slug);

    if (!note) {
      notFound();
    }

    return (
      <Container maxWidth="3xl">
        <NotesPostPresenter metadata={note.metadata} />
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <note.Content />
        </article>
      </Container>
    );
  } catch (error) {
    console.error(`Failed to load note with slug "${slug.join('/')}":`, error);
    notFound();
  }
}
