import React, { useEffect } from "react";
import type { TinaCMS } from "tinacms";
import { PublishSiteScreen } from "./PublishSite";

type NavigationCategory = "Settings" | "Pages" | "Content" | "Site";

interface NavigationItem {
    name: string;
    category: NavigationCategory;
    target: string;
}

const navigationItems: NavigationItem[] = [
    {
        name: "Site Settings",
        category: "Settings",
        target: "#/collections/edit/settings/~/site",
    },
    {
        name: "Tags",
        category: "Settings",
        target: "#/collections/tags/~",
    },
    {
        name: "Main Homepage",
        category: "Pages",
        target: "#/collections/edit/homepage/~/home",
    },
    {
        name: "Journal Homepage",
        category: "Pages",
        target: "#/collections/edit/archivePage/~/journal",
    },
    {
        name: "About",
        category: "Pages",
        target: "#/collections/edit/standardPage/~/about",
    },
    {
        name: "Contact",
        category: "Pages",
        target: "#/collections/edit/standardPage/~/contact",
    },
    {
        name: "Resume",
        category: "Pages",
        target: "#/collections/edit/resumePage/~/resume",
    },
    {
        name: "New Pages",
        category: "Pages",
        target: "#/collections/flexiblePages/~",
    },
    {
        name: "Journal Entries",
        category: "Content",
        target: "#/collections/entries/~",
    },
];

const NavigationIcon = ({ className = "" }: { className?: string }) =>
    React.createElement(
        "span",
        {
            className,
            "aria-hidden": true,
            style: {
                alignItems: "center",
                display: "inline-flex",
                fontSize: "1.25rem",
                justifyContent: "center",
            },
        },
        "›",
    );

const createRedirectScreen = (target: string) => {
    const RedirectScreen = () => {
        useEffect(() => {
            window.location.hash = target;
        }, []);

        return React.createElement(
            "p",
            { style: { padding: "2rem" } },
            "Opening editor…",
        );
    };

    return RedirectScreen;
};

const normalizeHeading = (heading: Element) =>
    heading.textContent?.trim().toLowerCase();

const organizeSidebar = () => {
    const headings = Array.from(document.querySelectorAll("h4"));
    const collectionsHeading = headings.find(
        (heading) => normalizeHeading(heading) === "collections",
    );

    if (!collectionsHeading) return;

    const navigation = collectionsHeading.parentElement;
    if (!navigation) return;

    collectionsHeading.setAttribute("hidden", "");
    collectionsHeading.nextElementSibling?.setAttribute("hidden", "");

    const siteHeading = headings.find(
        (heading) =>
            normalizeHeading(heading) === "site" &&
            heading.parentElement === navigation,
    );

    if (!siteHeading) return;

    const categoryGroups = ["Settings", "Pages", "Content"].map((category) => {
        const categoryHeading = headings.find(
            (heading) => normalizeHeading(heading) === category.toLowerCase(),
        );
        const categoryGroup = categoryHeading?.parentElement;

        return categoryGroup?.parentElement === navigation ? categoryGroup : undefined;
    });

    if (categoryGroups.some((group) => !group)) return;

    const [settingsGroup, pagesGroup, contentGroup] = categoryGroups as HTMLElement[];
    const isOrdered =
        pagesGroup.previousElementSibling === settingsGroup &&
        contentGroup.previousElementSibling === pagesGroup &&
        siteHeading.previousElementSibling === contentGroup;

    if (!isOrdered) {
        navigation.insertBefore(settingsGroup, siteHeading);
        navigation.insertBefore(pagesGroup, siteHeading);
        navigation.insertBefore(contentGroup, siteHeading);
    }
};

const installSidebarOrganizer = () => {
    if (typeof window === "undefined") return;

    const navigationWindow = window as typeof window & {
        __angrySquirrelNavigationInstalled?: boolean;
    };

    if (navigationWindow.__angrySquirrelNavigationInstalled) return;
    navigationWindow.__angrySquirrelNavigationInstalled = true;

    const observer = new MutationObserver(organizeSidebar);
    observer.observe(document.body, { childList: true, subtree: true });
    organizeSidebar();
};

export const installAdminNavigation = (cms: TinaCMS) => {
    const screens = cms.plugins.getType("screen").all();

    for (const item of navigationItems) {
        if (screens.some((screen) => screen.name === item.name)) continue;

        cms.plugins.add({
            __type: "screen",
            name: item.name,
            Component: createRedirectScreen(item.target),
            Icon: NavigationIcon,
            layout: "fullscreen",
            // Tina renders arbitrary screen categories even though its public
            // type currently lists only the built-in category names.
            navCategory: item.category,
        } as never);
    }

    if (!screens.some((screen) => screen.name === "Publish Site")) {
        cms.plugins.add({
            __type: "screen",
            name: "Publish Site",
            Component: PublishSiteScreen,
            Icon: NavigationIcon,
            layout: "fullscreen",
            navCategory: "Site",
        } as never);
    }

    installSidebarOrganizer();
    return cms;
};
