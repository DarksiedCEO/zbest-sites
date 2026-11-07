# Full-page visual coverage

The founder's follow-up authorized continuing the image work on `codex/story-pass-images` while the prerequisite PR operations remain deferred. The 36 story assets keep their original, single designated slots and unchanged bytes.

The coverage pass adds existing, badged concept artwork to previously empty headers, relevant service samples, hypothetical ZBC example cards, and the shared footers. Small code-drawn illustrations explain the existing leak library, visibility-gap library, assessment questions, engagement sequence and distribution models. These drawings carry accessible descriptions and illustrative labels; they introduce no measured results. Form illustrations are optional presentation props: scoring, validation, transport and result logic are unchanged.

## Blocking measurement

- All 21 non-exempt pages across both sites are checked at 1440 and 390, including unlinked Search Intelligence.
- Desktop uses 900px viewports, each requiring substantive imagery. Mobile uses 844px viewports and permits at most two consecutive text-only viewports.
- Every complete aligned viewport remains checked. An additional full viewport ends at the document bottom, unless already represented. Pages shorter than one viewport use their actual height.
- This corrects an impossible earlier case: an 11px remainder was treated as a viewport but required 24px of image intersection. The bottom viewport is still checked; footer-only whitespace is not exempted.
- The final overlapping mobile viewport continues a text-only run only when content extends beyond the previous complete band. Regression cases distinguish two complete empty bands from text continuing beyond them and verify that genuine tail imagery resets the run.
- Media must intersect a viewport by at least 24px, measure at least 80px in each dimension, be on-screen horizontally, and have no hidden or transparent ancestor. Images must have loaded. Decorative rules and small icons do not count.
- Genuine footer media is counted because the measured document includes the footer. Earlier code measured the footer but selected only main-content media.
- Exempt routes remain Start, Launch a Campaign, FAQ, Legal and 404. No new exemptions were added and the gate remains blocking.

The geometry regression tests cover 900, 901, 1800 and 2711px documents, short pages, real empty final viewports, the 24px threshold, and mobile continuation.
