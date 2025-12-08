import type { Meta, StoryObj } from '@storybook/react';
import { MdxCode, MdxPre } from './code-block';

const meta = {
  title: 'mdx/CodeBlock',
  component: MdxPre,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MdxPre>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CodeBlock: Story = {
  render: () => (
    <MdxPre>
      <MdxCode className="language-typescript" data-language="typescript">
        {`function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet('World');
console.log(message);`}
      </MdxCode>
    </MdxPre>
  ),
};

export const JavaScript: Story = {
  render: () => (
    <MdxPre>
      <MdxCode className="language-javascript" data-language="javascript">
        {`const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]`}
      </MdxCode>
    </MdxPre>
  ),
};

export const Python: Story = {
  render: () => (
    <MdxPre>
      <MdxCode className="language-python" data-language="python">
        {`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))`}
      </MdxCode>
    </MdxPre>
  ),
};

export const InlineCode: Story = {
  render: () => (
    <div className="space-y-2">
      <p>
        インラインコードの例: <MdxCode>const x = 42;</MdxCode>
      </p>
      <p>
        関数名もインラインコードで: <MdxCode>useState</MdxCode> や <MdxCode>useEffect</MdxCode>
      </p>
      <p>
        コマンドの例: <MdxCode>npm install</MdxCode> や <MdxCode>git commit -m "message"</MdxCode>
      </p>
    </div>
  ),
};

export const LongCode: Story = {
  render: () => (
    <MdxPre>
      <MdxCode className="language-typescript" data-language="typescript">
        {`// 長いコードブロックの例
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

const userService = new UserService();
await userService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
});`}
      </MdxCode>
    </MdxPre>
  ),
};
