# PRIV-IT

:trophy: Winner of the Innovation "What the Hack" prize at [NordicHack 2018](https://nordichack.com).

## Problem

- Identity theft (fake social media accounts)
- Unauthorised sharing of private pictures
- Copyright infringement

## Scenario

A user shares an image on social media / uploads it to a file sharing service / adds it to a website.
The image is then stolen by another user and reuploaded elsewhere.

There is no simple way for the original image owner to know when this happens.

## Solution

Before uploading, a cryptographic hash of the image's features (its fingerprint) is calculated and stored in a p2p append-only distributed database together with the public url.

Whenever an image is loaded by any participating member, the image's fingerprint is recalculated and compared with an entry in the database. If the fingerprint matches, but the public url does not - a potential theft - the image owner (as recorder in the database) will be notified.

## Possible uses

1. Detect copyright infringement on images / misuse of private images.
2. Retroactively find all matching images on (the live parts) of the Internet.
3. Social media sites / web browsers implementing this to automatically block stolen/copyrighted images.
