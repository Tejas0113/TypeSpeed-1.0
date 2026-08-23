import { Passage } from '../types';

export const PASSAGES: Passage[] = [
  {
    id: 'tech-1',
    title: 'The Craft of Code',
    category: 'Technology',
    text: 'Software development is both an engineering discipline and a creative art. Writing elegant software requires clear thinking, disciplined architecture, and empathy for those who maintain the codebase. Clean code explains itself through intention and structure.',
  },
  {
    id: 'prod-1',
    title: 'Focus in a Noisy World',
    category: 'Productivity',
    text: 'True productivity is never about rushing to finish countless shallow tasks. It is about protecting unbroken stretches of uninterrupted focus to do work that creates lasting value. When you eliminate distractions, quiet concentration becomes effortless.',
  },
  {
    id: 'sci-1',
    title: 'Cosmic Perspective',
    category: 'Science',
    text: 'Every atom inside our bodies was forged in the fiery heart of ancient collapsing stars. When we study the night sky, we are not looking at distant strangers, but discovering our own celestial origins across billions of years of cosmic evolution.',
  },
  {
    id: 'phil-1',
    title: 'The Art of Patience',
    category: 'Philosophy',
    text: 'Patience is not merely the ability to wait, but the wisdom to maintain a calm and purposeful disposition while doing so. Great accomplishments rarely happen overnight; they are built from small, consistent efforts made day after day.',
  },
  {
    id: 'tech-2',
    title: 'Simplicity and Design',
    category: 'Technology',
    text: 'Simplicity is not the lack of clutter; that is merely a consequence of simplicity. True simplicity is about purpose and clarity. The best interfaces feel almost invisible, empowering people to achieve their goals with minimum friction.',
  },
  {
    id: 'lit-1',
    title: 'Morning Light',
    category: 'Literature',
    text: 'Dawn arrived quietly over the coastal hills, casting golden rays across the misty valleys. The morning air was crisp and scented with pine and damp earth, inviting early walkers to witness the peaceful awakening of the natural world.',
  },
  {
    id: 'prod-2',
    title: 'Daily Momentum',
    category: 'Productivity',
    text: 'Consistency builds momentum faster than occasional bursts of intense effort. When you establish dependable daily habits, discipline replaces motivation and complex challenges gradually transform into achievable milestones.',
  },
  {
    id: 'sci-2',
    title: 'The Power of Curiosity',
    category: 'Science',
    text: 'Scientific discovery begins with keen observation and the humility to question established assumptions. Nature constantly presents subtle puzzles waiting for patient minds to decipher the hidden laws governing physical reality.',
  },
  {
    id: 'tech-3',
    title: 'Speed and Precision',
    category: 'Technology',
    text: 'Mastering the keyboard is like learning a musical instrument. Speed develops naturally from muscle memory, rhythmic cadence, and consistent accuracy. When your fingers move with effortless precision, your thoughts flow directly into the machine.',
  },
  {
    id: 'everyday-1',
    title: 'The Habit of Reading',
    category: 'Everyday',
    text: 'Reading books is one of the most transformative habits a person can cultivate. Each page offers a portal into different minds, distant eras, and profound insights that expand your perspective and deepen your understanding of life.',
  },
  {
    id: 'phil-2',
    title: 'Mastering the Present',
    category: 'Philosophy',
    text: 'We often spend precious energy worrying about uncertain futures or regretting past decisions. Yet the present moment is the only place where deliberate action can change our trajectory and shape meaningful outcomes.',
  },
  {
    id: 'tech-4',
    title: 'Building for the Long Term',
    category: 'Technology',
    text: 'Modern digital systems must be resilient, accessible, and fast. Performance is not a feature you bolt on at the very end; it is a foundational principle that must guide every architectural choice from the initial concept.',
  }
];

export function getRandomPassage(excludeId?: string): Passage {
  const available = excludeId ? PASSAGES.filter((p) => p.id !== excludeId) : PASSAGES;
  const pool = available.length > 0 ? available : PASSAGES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
