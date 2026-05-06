"use client";

import { Avatar, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Route } from "next";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { useUser } from "@stackframe/stack";

type UserProfileProps = {
  showNavigationLinks?: boolean;
};

const UserProfile = React.memo(
  ({ showNavigationLinks = true }: UserProfileProps) => {
    const user = useUser();

    const handleLogout = useCallback(() => {
      void user?.signOut();
    }, [user]);
    
    // Memoize user data extraction
    type UserProfileData = {
      name: string;
      email: string;
      image?: string;
    };

    const userData = useMemo<UserProfileData>(() => {
      const name =
        typeof user?.displayName === "string" && user.displayName.trim().length > 0
          ? user.displayName
          : "User";

      const email =
        typeof user?.primaryEmail === "string" && user.primaryEmail.trim().length > 0
          ? user.primaryEmail
          : "";

      const image = typeof user?.profileImageUrl === "string" ? user.profileImageUrl : undefined;

      return {
        name,
        email,
        image,
      };
    }, [user]);

    // Memoize navigation items for better performance
    const navigationItems = useMemo(
      () => [
        {
          key: "settings",
          href: "/settings",
          icon: "solar:settings-bold-duotone",
          label: "Settings",
        },
      ],
      []
    );

    // Memoize dropdown menu items
    const dropdownContent = useMemo(
      () => (
        <Dropdown.Menu>
          <Dropdown.Section>
            <Dropdown.Item
              id="profile"
              className="h-16 gap-2 cursor-default hover:bg-transparent"
              textValue="Profile"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Avatar.Image src={userData.image || undefined} alt={userData.name} />
                  <Avatar.Fallback>{userData.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">{userData.name}</p>
                  <p className="text-xs text-muted">{userData.email}</p>
                </div>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Section>
            <Dropdown.Item
              id="theme"
              className="gap-2 py-2"
              textValue="Appearance"
            >
              <Label>Appearance</Label>
            </Dropdown.Item>
          </Dropdown.Section>
          {showNavigationLinks ? (
            <Dropdown.Section>
              {navigationItems.map((item) => (
                <Dropdown.Item
                  key={item.key}
                  id={item.key}
                  className="py-2"
                  textValue={item.label}
                >
                  <Link
                    href={item.href as Route}
                    className="flex items-center gap-2"
                  >
                    <Icon icon={item.icon} width={20} className="text-muted" />
                    <Label className="text-sm font-medium">{item.label}</Label>
                  </Link>
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          ) : null}
          <Dropdown.Section>
            <Dropdown.Item
              id="logout"
              className="text-danger data-[hover=true]:bg-danger data-[hover=true]:text-danger py-2"
              textValue="Log Out"
              onPress={handleLogout}
            >
              <Label className="text-sm font-semibold">Log Out</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      ),
      [
        handleLogout,
        userData,
        navigationItems,
        showNavigationLinks,
      ]
    );

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <span className="inline-flex rounded-full">
            <Avatar
              className="border-2 border-background transition-transform hover:scale-105"
              size="sm"
            >
              <Avatar.Image src={userData.image || undefined} alt={userData.name} />
              <Avatar.Fallback>{userData.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
            </Avatar>
          </span>
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          {dropdownContent}
        </Dropdown.Popover>
      </Dropdown>
    );
  }
);

UserProfile.displayName = "UserProfile";

export default UserProfile;
