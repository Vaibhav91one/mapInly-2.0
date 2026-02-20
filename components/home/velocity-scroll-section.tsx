"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { CommunityCard } from "./community-card";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";

const COMMUNITIES_1 = [
  { name: "Lugano Explorers", image: "https://picsum.photos/seed/lugano/200/200" },
  { name: "Ticino Events", image: "https://picsum.photos/seed/ticino/200/200" },
  { name: "Swiss Connect", image: "https://picsum.photos/seed/swiss/200/200" },
  { name: "Local Meetups", image: "https://picsum.photos/seed/meetups/200/200" },
  { name: "Culture Hub", image: "https://picsum.photos/seed/culture/200/200" },
];

const COMMUNITIES_2 = [
  { name: "Lake Geneva", image: "https://picsum.photos/seed/geneva/200/200" },
  { name: "Zurich Social", image: "https://picsum.photos/seed/zurich/200/200" },
  { name: "Bern Events", image: "https://picsum.photos/seed/bern/200/200" },
  { name: "Basel Community", image: "https://picsum.photos/seed/basel/200/200" },
  { name: "Alpine Adventures", image: "https://picsum.photos/seed/alpine/200/200" },
];

export function VelocityScrollSection() {
  return (
    <section className={cn(sectionClasses, "bg-black py-24")}>
      <ScrollVelocityContainer className="flex flex-col">
        <ScrollVelocityRow baseVelocity={3} direction={1} className="py-4">
          <div className="inline-flex items-center gap-2 pr-2">
            {COMMUNITIES_1.map((community) => (
              <CommunityCard
                key={community.name}
                name={community.name}
                image={community.image}
                href={`/communities/${community.name.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </div>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={3} direction={-1} className="py-4">
          <div className="inline-flex items-center gap-2 pr-2">
            {COMMUNITIES_2.map((community) => (
              <CommunityCard
                key={community.name}
                name={community.name}
                image={community.image}
                href={`/communities/${community.name.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </div>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  );
}

