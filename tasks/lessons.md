# MPSeeker Development Lessons

## Purpose
Document patterns, solutions, and mistakes to prevent repetition and improve development quality.

## Lessons Learned

### Mobile Touch Event Handling
**Issue**: Long-press detection conflicts with existing drag system
**Pattern**: Mobile touch events require isolated testing and can't piggyback on desktop event handlers
**Solution**: Use separate interaction paradigms (burst mode button vs right-click)
**Prevention**: Test mobile interactions early and independently from desktop implementations

### Data Model Completeness in Copy/Paste Features
**Issue**: Copy/paste only copied pattern steps, not sample parameters (sounds, pitch, decay)
**Root Cause**: Incomplete understanding of data model scope
**Pattern**: Complex features require mapping ALL related data structures
**Solution**: Always audit complete data model when implementing copy/paste type features
**Prevention**: Create data model diagrams before implementing cross-cutting features

### RPC Endpoint Reliability
**Issue**: Third-party RPC endpoints returning 403 errors for transactions
**Pattern**: Production apps need reliable infrastructure dependencies
**Solution**: Use official Solana cluster URLs (`solanaWeb3.clusterApiUrl`)
**Prevention**: Start with official endpoints, only use third-party as optimization later

### Feature Complexity Planning
**Issue**: Donation system had multiple failed attempts due to wallet integration complexity
**Pattern**: Features touching external systems (wallets, APIs) are inherently complex
**Solution**: Plan architecture first, implement in isolation, integrate last
**Prevention**: Use plan mode for any feature with external dependencies

### Mobile UI/UX Paradigms
**Issue**: Direct ports from desktop don't work well on mobile (right-click → long-press)
**Pattern**: Mobile needs native interaction patterns, not desktop translations
**Solution**: Design mobile-first interactions that feel natural on touch
**Prevention**: Consider mobile constraints during initial feature design, not as afterthought

### Debugging and Error Diagnosis
**Issue**: Multiple bugs required systematic debugging rather than guessing
**Pattern**: Complex systems require methodical diagnosis
**Solution**: Add strategic logging, test in isolation, verify one component at a time
**Prevention**: Build debugging tools/logging into features from the start

### Version Control and Feature Flags
**Issue**: Needed to revert to clean versions multiple times during donation system work
**Pattern**: Experimental features can break working systems
**Solution**: Keep clean backup copies, implement behind feature flags when possible
**Prevention**: Branch/save clean versions before starting experimental work

## Best Practices Developed

### Before Starting Any Feature
1. Is this 3+ steps or involves architectural decisions? → Enter plan mode
2. Does it touch external systems? → Plan integration strategy first
3. Will it work on both desktop and mobile? → Design for both from start

### During Implementation
1. Test in isolation before integrating
2. Add logging/debugging tools as you go
3. Verify each component works before combining
4. Keep clean backup versions

### Before Marking Complete
1. Test on both desktop and mobile
2. Check all edge cases
3. Verify no regressions in existing features
4. Ask: "Would a senior developer approve this?"

### After User Corrections
1. Document the pattern that caused the issue
2. Create prevention rule for future similar work
3. Update this lessons file immediately

## Success Patterns

### What Worked Well
- **Incremental development**: Building burst system step by step
- **User feedback integration**: Quick iterations based on testing results
- **Clean separation of concerns**: Audio engine separate from UI
- **Comprehensive testing**: Desktop + mobile verification
- **Asset preparation**: Having all store assets ready before submission

### Workflow Strengths
- Systematic debugging approach
- Willingness to restart when needed
- Focus on user experience over technical convenience
- Thorough integration testing before delivery

## Next Session Reminders

### Review This File
- Check if current task relates to any previous lessons
- Apply relevant prevention strategies
- Update with new lessons after any corrections

### Key Questions to Ask
1. Have we seen this type of problem before?
2. What patterns from previous work apply?
3. Are we following our established best practices?
4. What would we do differently knowing what we know now?
