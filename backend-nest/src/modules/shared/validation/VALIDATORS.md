# Entity Validators Documentation

This directory contains a structured validation system for entity existence checks following OOP best practices.

## Architecture Overview

The validation system is built using an abstract base class pattern (`BaseValidator`) that provides common functionality, with specific validators for each entity type inheriting from it.

## Structure

### Base Validator (`base.validator.ts`)

The `BaseValidator<T>` is an abstract generic class that provides common validation methods for all entities:

- **`validateExists(id, errorMessage?)`** - Validates entity existence by ID
- **`validateExistsWithRelations(id, relations, errorMessage?)`** - Validates entity existence and loads specified relations
- **`validateExistsWhere(where, errorMessage?)`** - Validates entity existence with custom where clause
- **`getEntityName()`** - Returns entity name for error messages (can be overridden)

### Entity Validators

#### UserValidator
Validates User entities
- `validateUserExists(userId)` - Check if user exists

#### BlogValidator
Validates Blog entities with complex business logic
- `validateBlogExists(blogId)` - Check if blog exists
- `validateBlogWithSpace(blogId)` - Get blog with space relations
- `validateBlogWithSpaceAndUser(blogId)` - Get blog with space and user relations
- `validateUserIsBlogOwner(blogId, userId)` - Verify user owns the blog
- `validateUserCanAccessBlog(blogId, userId?)` - Check access considering private spaces
- `validateUserCanAccessPrivateBlog(blogId, userId)` - Check access to private space blogs

#### SpaceValidator
Validates Space entities
- `validateSpaceExists(spaceId)` - Check if space exists

#### CommentValidator
Validates Comment entities
- `validateCommentExists(commentId)` - Check if comment exists
- `validateCommentWithRelations(commentId)` - Get comment with blog and author relations

#### LikeValidator
Validates Like entities
- `validateLikeDoesNotExist(blogId, userId)` - Ensure like hasn't been created yet
- `validateLikeExists(blogId, userId)` - Verify like exists

#### MemberValidator
Validates Member entities and space membership
- `validateMemberExists(memberId)` - Check if member exists
- `validateUserIsSpaceMember(spaceId, userId)` - Verify user is space member
- `checkMembership(spaceId, userId)` - Helper to check membership without throwing

#### ChatValidator
Validates Chat-related entities
- `validateChatMessageExists(messageId)` - Check if message exists
- `validateConversationExists(conversationId)` - Check if conversation exists

#### TagValidator
Validates Tag entities
- `validateTagExists(tagId)` - Check if tag exists

#### NotificationValidator
Validates Notification entities
- `validateNotificationExists(notificationId)` - Check if notification exists

## Usage Example

```typescript
import { BlogValidator, UserValidator } from 'src/modules/shared/validation/validators';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogValidator: BlogValidator,
    private readonly userValidator: UserValidator,
  ) {}

  @Get(':blogId')
  async getBlog(@Param('blogId') blogId: string) {
    // Validates blog exists with space relation
    const blog = await this.blogValidator.validateBlogWithSpace(blogId);
    return blog;
  }

  @Put(':blogId')
  async updateBlog(
    @Param('blogId') blogId: string,
    @Req() req: any,
  ) {
    // Validates user owns the blog
    const blog = await this.blogValidator.validateUserIsBlogOwner(
      blogId,
      req.user.id,
    );
    // Update logic...
    return blog;
  }
}
```

## Error Handling

All validators throw appropriate NestJS HTTP exceptions:
- `NotFoundException` - Entity not found
- `ForbiddenException` - Access denied or permission issues
- `ConflictException` - Conflicting state (e.g., already liked)

## OOP Best Practices Applied

1. **Abstraction** - Common logic in `BaseValidator` base class
2. **Inheritance** - Each entity validator extends `BaseValidator`
3. **Single Responsibility** - Each validator handles only one entity type
4. **Dependency Injection** - Using NestJS `@Injectable()` and `@InjectRepository`
5. **Encapsulation** - Protected and private methods hide implementation details
6. **Polymorphism** - Override `getEntityName()` for custom error messages
7. **Type Safety** - Generic types ensure type safety across all validators

## Integration with Modules

The `ValidationModule` exports all validators as providers, making them available to other modules via dependency injection:

```typescript
import { ValidationModule } from 'src/modules/shared/validation/validation.module';

@Module({
  imports: [ValidationModule],
  // ... rest of module config
})
export class YourModule {}
```

Then inject in your services/controllers:

```typescript
constructor(
  private readonly blogValidator: BlogValidator,
  private readonly userValidator: UserValidator,
) {}
```

## Migration from ValidateEntity

The old `ValidateEntity` provider is still maintained for backward compatibility. New code should use the individual validators:

**Before:**
```typescript
this.validateEntity.validateBlogExists(blogId);
```

**After:**
```typescript
this.blogValidator.validateBlogExists(blogId);
```

## Contributing

When adding new entities:
1. Create a new validator class extending `BaseValidator<YourEntity>`
2. Add entity-specific validation methods
3. Add the validator to `ValidationModule` imports and exports
4. Export from `validators/index.ts`
5. Add to this documentation
