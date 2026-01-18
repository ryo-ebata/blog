'use client';

import { IconBrandGithub, IconBrandX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BackLink } from '@/components/atoms';
import { BuyMeACoffee } from '@/components/molecules';
import { Container } from '@/components/organisms';
import { siteConfig } from '@/config/site';

const IMAGE_SIZE = 20;

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-bold scroll-m-20 border-b pb-2 text-xl tracking-tight text-foreground">
    {children}
  </h2>
);

const SocialLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary hover:text-primary/80 underline transition-colors duration-200"
  >
    {label}
  </Link>
);

const SocialLinkItem = ({
  icon,
  href,
  label,
}: {
  icon: ReactNode;
  href: string;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    {icon}
    <SocialLink href={href} label={label} />
  </div>
);

const AboutHeader = () => (
  <div className="mb-12 text-center space-y-4">
    <h1 className="font-bold scroll-m-20 text-3xl text-foreground">About</h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">自己紹介とソーシャルリンク</p>
  </div>
);

const AboutBlogSection = () => (
  <div className="bg-card border rounded-lg p-6">
    <SectionHeading>About Blog</SectionHeading>
    <div className="mt-4 space-y-4 text-muted-foreground">
      <p className="leading-7">
        単なる情報（Information）ではなく、
        知識（Knowledge）・意見（Opinion）・気付き（Insight）を書きます。
        技術的な内容も含め、思考のメモなどを残していきます。
      </p>
    </div>
  </div>
);

const AboutMeDescription = () => (
  <p className="leading-7 whitespace-pre-line">
    {`Software Engineer.
Interests: Generative AI, Rust, etc.
Works: Frontend Engineer, Data Engineering.
Hobbies: Anime, Basketball, Mahjong, Travel, etc.`}
  </p>
);

const AboutMeSection = () => (
  <div className="bg-card border rounded-lg p-6">
    <SectionHeading>About Me</SectionHeading>
    <div className="mt-4 space-y-4 text-muted-foreground">
      <AboutMeDescription />
    </div>
  </div>
);

const TwitterIcon = () => <IconBrandX className="h-5 w-5" />;

const GithubIcon = () => <IconBrandGithub className="h-5 w-5" />;

const ZennIcon = () => (
  <Image alt="Zenn" height={IMAGE_SIZE} src="/image/zenn-logo/logo-only.svg" width={IMAGE_SIZE} />
);

const QiitaIcon = () => (
  <Image
    alt="Qiita"
    height={IMAGE_SIZE}
    src="/image/qiita-icon/qiita-icon.png"
    width={IMAGE_SIZE}
  />
);

const TwitterLink = () => {
  if (!siteConfig.links.twitter) {
    return null;
  }
  return (
    <SocialLinkItem
      icon={<TwitterIcon />}
      href={siteConfig.links.twitter}
      label={siteConfig.links.twitter}
    />
  );
};

const GithubLink = () => {
  if (!siteConfig.links.github) {
    return null;
  }
  return (
    <SocialLinkItem
      icon={<GithubIcon />}
      href={siteConfig.links.github}
      label={siteConfig.links.github}
    />
  );
};

const ZennLink = () => {
  if (!siteConfig.links.zenn) {
    return null;
  }
  return (
    <SocialLinkItem
      icon={<ZennIcon />}
      href={siteConfig.links.zenn}
      label={siteConfig.links.zenn}
    />
  );
};

const QiitaLink = () => {
  if (!siteConfig.links.qiita) {
    return null;
  }
  return (
    <SocialLinkItem
      icon={<QiitaIcon />}
      href={siteConfig.links.qiita}
      label={siteConfig.links.qiita}
    />
  );
};

const SocialLinksList = () => (
  <div className="mt-4 space-y-2">
    <TwitterLink />
    <GithubLink />
    <ZennLink />
    <QiitaLink />
  </div>
);

const SocialLinksSection = () => (
  <div className="bg-card border rounded-lg p-6">
    <SectionHeading>Social Links</SectionHeading>
    <SocialLinksList />
  </div>
);

const AboutContent = () => (
  <div className="space-y-6">
    <AboutBlogSection />
    <AboutMeSection />
    <SocialLinksSection />
    <div className="text-end">
      <BackLink href="/" label="ホームに戻る" />
    </div>
  </div>
);

export const AboutPresenter = () => (
  <Container maxWidth="4xl">
    <div className="space-y-12">
      <AboutHeader />
      <AboutContent />
    </div>
    <BuyMeACoffee />
  </Container>
);
