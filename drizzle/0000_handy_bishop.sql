CREATE TABLE `urls` (
	`id` integer PRIMARY KEY NOT NULL,
	`short` text NOT NULL,
	`long` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `urls_short_unique` ON `urls` (`short`);--> statement-breakpoint
CREATE UNIQUE INDEX `urls_long_unique` ON `urls` (`long`);