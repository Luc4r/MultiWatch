# MultiWatch
App for watching multiple streams at the same time. 

#### Current features:
- Supported platforms: Twitch, YouTube (video only), Smashcast, Mixer
- Video functionality:
   - Move
   - Scale
   - Pin (Maximize)
- Chat functionality:
   - Show / Hide
   - Select chat (when multiple streams opened)
   - Change width (up to 50% of the screen)
- Additional features:
   - Show / Hide top bar
   - Restore previous setup (localStorage)
   - User settings: show chat, pinned videos layout (Z-Shape, Horizontal, Vertical)

#### To do:
- Check/rewrite Video component -> fetch as separate module, movement as separate module
- Change options menu style
- Lots of stuff are handled by setTimeout methods - check/update/replace them if possible
- Optimize app (mostly moving videos around) -> update Video component (performance issues)
- Add helpers/manual
- Update design, CSS
- (In long, long future...) Integrate login panels

#### KNOWN ISSUES:
- User can open 2 of the same YouTube stream (via ID and NAME) - nothing breaks though
- After spamming the 'show chat' checkbox chat can disappear (setTimeout method issue)