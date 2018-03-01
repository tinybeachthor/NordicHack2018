# PRIV-IT

:trophy: Winner of the Innovation "What the Hack" prize at [NordicHack 2018](https://nordichack.com)

## Problem

- identity theft (fake social media accounts)
- unauthorised sharing of private images
- copyright infridgement

## Scenario

A user shares an image through a social media / uploads it to a file sharing service / adds it to an website. The image is then stolen by another user and uploaded elsewhere (a fake profile, copyright infridgement). 

There is no simple way for the original uploader to detect this. 

## Solution

Before sending, a cryptographic hash of the image (it's fingerprint) is calculated.

If an image with a used fingerprint is displayed on a new/untracked site, the original uploader is notified and provided with the URL.

## Possible uses

1. Detect copyright infrindgment on images / misuse of private images (nudes)
2. Find all images of myself on the internet
3. Social media / web browsers implementing this to automatically block stolen images
