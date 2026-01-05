'use client';

import { IconBrandGithub, IconBrandX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/composites/container';
import { BackLink, BuyMeACoffee } from '@/components/elements';
import { siteConfig } from '@/config/site';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold scroll-m-20 border-b pb-2 text-xl tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 underline transition-colors duration-200"
    >
      {label}
    </Link>
  );
}

export function AboutPresenter() {
  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="font-bold scroll-m-20 text-3xl text-foreground">About</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            自己紹介とソーシャルリンク
          </p>
        </div>

        <div className="space-y-6">
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

          <div className="bg-card border rounded-lg p-6">
            <SectionHeading>About Me</SectionHeading>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p className="leading-7">
                Software Engineer.
                <br />
                Interests: Generative AI, Rust, etc.
                <br />
                Works: Frontend Engineer, Data Engineering.
                <br />
                Hobbies: Anime, Basketball, Mahjong, Travel, etc.
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <SectionHeading>Social Links</SectionHeading>
            <div className="mt-4 space-y-2">
              {siteConfig.links.twitter && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconBrandX className="h-5 w-5" />
                  <SocialLink href={siteConfig.links.twitter} label={siteConfig.links.twitter} />
                </div>
              )}
              {siteConfig.links.github && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconBrandGithub className="h-5 w-5" />
                  <SocialLink href={siteConfig.links.github} label={siteConfig.links.github} />
                </div>
              )}
              {siteConfig.links.zenn && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image src="/image/zenn-logo/logo-only.svg" alt="Zenn" width={20} height={20} />
                  <SocialLink href={siteConfig.links.zenn} label={siteConfig.links.zenn} />
                </div>
              )}
              {siteConfig.links.qiita && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image
                    src="/image/qiita-icon/qiita-icon.png"
                    alt="Qiita"
                    width={20}
                    height={20}
                  />
                  <SocialLink href={siteConfig.links.qiita} label={siteConfig.links.qiita} />
                </div>
              )}
            </div>
          </div>

          <div className="text-end">
            <BackLink href="/" label="ホームに戻る" />
          </div>
        </div>
      </div>
      <BuyMeACoffee />
    </Container>
  );
}
