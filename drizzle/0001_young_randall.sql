CREATE TABLE `urls` (
	`id` integer PRIMARY KEY NOT NULL,
	`short` text NOT NULL,
	`long` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `users`;