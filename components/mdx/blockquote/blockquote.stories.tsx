import type { Meta, StoryObj } from '@storybook/react';
import { MdxBlockquote } from './blockquote';

const meta = {
  title: 'mdx/Blockquote',
  component: MdxBlockquote,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '引用のテキスト',
    },
  },
} satisfies Meta<typeof MdxBlockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'これは引用テキストの例です。',
  },
};

export const LongQuote: Story = {
  args: {
    children:
      'これは長い引用テキストの例です。複数の文を含む引用を表示する際に、どのように見えるかを確認できます。引用は通常、重要な情報や他者からの言葉を強調するために使用されます。',
  },
};

export const MultipleParagraphs: Story = {
  args: {},
  render: () => (
    <MdxBlockquote>
      <p>これは引用の最初の段落です。</p>
      <p>これは引用の2番目の段落です。複数の段落を含む引用も適切に表示されます。</p>
    </MdxBlockquote>
  ),
};

export const WithInlineElements: Story = {
  args: {},
  render: () => (
    <MdxBlockquote>
      これは<strong>強調されたテキスト</strong>や<em>イタリック体</em>を含む引用の例です。
    </MdxBlockquote>
  ),
};

export const MultipleQuotes: Story = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <MdxBlockquote>最初の引用です。短い引用の例です。</MdxBlockquote>
      <MdxBlockquote>
        2番目の引用です。これは少し長い引用の例で、複数の文を含んでいます。引用は重要な情報を強調するために使用されます。
      </MdxBlockquote>
      <MdxBlockquote>3番目の引用です。最後の引用の例です。</MdxBlockquote>
    </div>
  ),
};
