# Image Optimization Spec

## Task

Optimize and integrate the provided images so they display consistently and appropriately across:
- Game cards
- Navbar logo

Resize, crop, or reframe images where necessary without noticeably degrading image quality or distorting the subject.

## Reference

Use the source images from `@context/img/`.

Use the existing page layouts and components to determine the appropriate image dimensions and aspect ratios.

## Image Handling Rules

- Preserve the original aspect ratio whenever possible.
- Do not stretch or distort images.
- Crop only when necessary to achieve a consistent presentation.
- Keep the main subject visible and well-positioned after cropping.
- Use consistent aspect ratios for images serving the same component type.
- Optimize file size while maintaining good visual quality.
- Prefer modern web-friendly formats when appropriate.
- Avoid unnecessarily large image dimensions compared with their rendered size.
- Reuse the same optimized asset where the same image appears multiple times.
- Use appropriate `object-fit` and positioning behavior where cropping is handled by the UI.
- Ensure the navbar logo remains sharp and readable at its displayed size.

## Integration

- Add the appropriate optimized images to each game card.
- Add the correct logo asset to the navbar.
- Use meaningful `alt` text for content images.
- Use empty `alt` text for purely decorative images where appropriate.
- Preserve existing layout and component behavior unless an adjustment is required for proper image presentation.

## Acceptance Criteria

- All intended game cards display the correct images.
- The navbar displays the correct logo.
- Images are not visibly stretched, squashed, or distorted.
- Game-card images have a consistent visual size and aspect ratio.
- Important image subjects are not unintentionally cropped out.
- Images remain sharp at normal display sizes.
- Image files are reasonably optimized for web delivery.
- No broken image paths are present.
- Image presentation works correctly across desktop and mobile layouts.
- Appropriate alternative text is provided for accessibility.