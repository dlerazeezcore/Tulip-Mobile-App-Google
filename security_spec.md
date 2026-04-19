# Security Specification - Tulip Booking

## Data Invariants
1. Users can only read and write their own profile data.
2. Users can only see their own bookings.
3. The `userId` in a booking must match the authenticated user's UID.
4. Bookings cannot be modified once 'confirmed' except for status cancellation.
5. Email must be verified for all write operations.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Identity Spoofing**: Attempt to create a user profile with `uid` that doesn't match `request.auth.uid`.
2. **PII Breach**: Authenticated User A tries to read User B's private info.
3. **Orphaned Booking**: Creating a booking for a `userId` that is not the current user.
4. **State Skip**: Directly creating a booking with `status: 'confirmed'` (should start as 'pending').
5. **Privilege Escalation**: User tries to update `membershipLevel` to 'Diamond' themselves.
6. **Unverified Write**: Writing data while `email_verified` is false.
7. **Resource Poisoning**: Using a 1MB string as a `displayName`.
8. **ID Injection**: Using a long, invalid string as a document ID.
9. **Timestamp Spoofing**: Setting `createdAt` to a future date instead of `request.time`.
10. **Bookings List Leak**: Fetching all bookings without a `where('userId', '==', uid)` filter.
11. **Shadow Update**: Updating a booking and adding a `promoCode` field that isn't in the schema.
12. **Public PII**: Storing email in the top-level `/users/{userId}` without restricting read access to owner.

## Test Runner (firestore.rules)
Verified via manual logic audit and ESLint.
