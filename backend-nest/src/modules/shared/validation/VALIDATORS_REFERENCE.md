/**
 * Quick Reference: All Available Validators
 *
 * Import all validators from:
 * import {
 *   UserValidator,
 *   BlogValidator,
 *   SpaceValidator,
 *   CommentValidator,
 *   LikeValidator,
 *   MemberValidator,
 *   ChatValidator,
 *   TagValidator,
 *   NotificationValidator,
 * } from 'src/modules/shared/validation/validators';
 */

// ============================================================================
// UserValidator - User Entity Validation
// ============================================================================
// validateUserExists(userId: string): Promise<User>
//   - Validates that a user exists by ID
//   - Throws: NotFoundException

// ============================================================================
// BlogValidator - Blog Entity Validation with Access Control
// ============================================================================
// validateBlogExists(blogId: string): Promise<Blog>
//   - Validates that a blog exists
//   - Throws: NotFoundException

// validateBlogWithSpace(blogId: string): Promise<Blog>
//   - Validates blog exists with space relation loaded
//   - Throws: NotFoundException

// validateBlogWithSpaceAndUser(blogId: string): Promise<Blog>
//   - Validates blog exists with space and user relations loaded
//   - Throws: NotFoundException

// validateUserIsBlogOwner(blogId: string, userId: string): Promise<Blog>
//   - Validates user is the blog owner
//   - Throws: NotFoundException, ForbiddenException

// validateUserCanAccessBlog(blogId: string, userId?: string): Promise<Blog>
//   - Validates user can access blog (checks private space membership if needed)
//   - Throws: NotFoundException, ForbiddenException

// validateUserCanAccessPrivateBlog(blogId: string, userId: string): Promise<Blog>
//   - Validates user can access private space blog
//   - Throws: NotFoundException, ForbiddenException

// ============================================================================
// SpaceValidator - Space Entity Validation
// ============================================================================
// validateSpaceExists(spaceId: string): Promise<Space>
//   - Validates that a space exists
//   - Throws: NotFoundException

// ============================================================================
// CommentValidator - Comment Entity Validation
// ============================================================================
// validateCommentExists(commentId: string): Promise<Comment>
//   - Validates that a comment exists
//   - Throws: NotFoundException

// validateCommentWithRelations(commentId: string): Promise<Comment>
//   - Validates comment exists with blog and author relations loaded
//   - Throws: NotFoundException

// ============================================================================
// LikeValidator - Like Entity Validation
// ============================================================================
// validateLikeDoesNotExist(blogId: string, userId: string): Promise<void>
//   - Validates that a like doesn't already exist
//   - Throws: ConflictException

// validateLikeExists(blogId: string, userId: string): Promise<Like>
//   - Validates that a like exists
//   - Throws: ConflictException

// ============================================================================
// MemberValidator - Member Entity and Space Membership Validation
// ============================================================================
// validateMemberExists(memberId: string): Promise<Member>
//   - Validates that a member exists
//   - Throws: NotFoundException

// validateUserIsSpaceMember(spaceId: string, userId: string): Promise<boolean>
//   - Validates user is a member of the space
//   - Throws: ForbiddenException

// checkMembership(spaceId: string, userId: string): Promise<boolean>
//   - Helper method to check membership without throwing
//   - Returns: true if member, false otherwise

// ============================================================================
// ChatValidator - Chat Message and Conversation Validation
// ============================================================================
// validateChatMessageExists(messageId: string): Promise<ChatMessage>
//   - Validates that a chat message exists
//   - Throws: NotFoundException

// validateConversationExists(conversationId: string): Promise<PrivateConversation>
//   - Validates that a conversation exists
//   - Throws: NotFoundException

// ============================================================================
// TagValidator - Tag Entity Validation
// ============================================================================
// validateTagExists(tagId: string): Promise<Tag>
//   - Validates that a tag exists
//   - Throws: NotFoundException

// ============================================================================
// NotificationValidator - Notification Entity Validation
// ============================================================================
// validateNotificationExists(notificationId: string): Promise<Notification>
//   - Validates that a notification exists
//   - Throws: NotFoundException

// ============================================================================
// BaseValidator - Base Class Methods (available in all validators)
// ============================================================================
// validateExists(id: string, errorMessage?: string): Promise<T>
//   - Basic existence validation by ID
//   - Returns: The entity
//   - Throws: NotFoundException

// validateExistsWithRelations(id: string, relations: string[], errorMessage?: string): Promise<T>
//   - Validate existence and load specified relations
//   - Returns: The entity with relations loaded
//   - Throws: NotFoundException

// validateExistsWhere(where: any, errorMessage?: string): Promise<T>
//   - Validate existence with custom where clause
//   - Returns: The entity
//   - Throws: NotFoundException
