CREATE TABLE `block` (
	`data` text NOT NULL,
	`hash` text PRIMARY KEY NOT NULL,
	`prev_hash` text NOT NULL,
	`timestamp` integer NOT NULL
);
