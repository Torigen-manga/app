CREATE TABLE `app_manga` (
	`source_id` text NOT NULL,
	`manga_id` text NOT NULL,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`description` text,
	`authors` text,
	`artists` text,
	`genres` text,
	`status` text NOT NULL,
	PRIMARY KEY(`source_id`, `manga_id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE TABLE `library_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`manga_id` text NOT NULL,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`added_at` integer NOT NULL,
	`cached_total_chapters` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `library_unique` ON `library_entry` (`manga_id`,`source_id`);--> statement-breakpoint
CREATE TABLE `library_entry_with_category` (
	`library_entry_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`library_entry_id`, `category_id`),
	FOREIGN KEY (`library_entry_id`) REFERENCES `library_entry`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
