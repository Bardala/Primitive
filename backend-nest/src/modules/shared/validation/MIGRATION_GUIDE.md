# Migration Guide: From ValidateEntity to Individual Validators

This guide helps migrate from the old monolithic `ValidateEntity` provider to the new individual validators following OOP best practices.

## Why Migrate?

✅ Better separation of concerns
✅ Improved type safety with generics
✅ Easier to test individual validators
✅ More maintainable and scalable
✅ Follows SOLID principles (Single Responsibility)
✅ Better IDE autocomplete and intellisense

## Migration Steps

### Step 1: Update Module Imports
**Before:**
```typescript
import { ValidationModule } from 'src/modules/shared/validation/validation.module';

@Module({
  imports: [ValidationModule],
})
export class YourModule {}
```

**After:** (No change needed - ValidationModule provides both!)
```typescript
import { ValidationModule } from 'src/modules/shared/validation/validation.module';

@Module({
  imports: [ValidationModule],
})
export class YourModule {}
```

### Step 2: Update Controller/Service Injection

**Before:**
```typescript
import { ValidateEntity } from 'src/modules/shared/validation/validate-entity.provider';

@Controller('blogs')
export class BlogController {
  constructor(private validateEntity: ValidateEntity) {}

  @Get(':blogId')
  async getBlog(@Param('blogId') blogId: string) {
    const blog = await this.validateEntity.validateBlogExists(blogId);
    return blog;
  }
}
```

**After:**
```typescript
import { BlogValidator } from 'src/modules/shared/validation/validators';

@Controller('blogs')
export class BlogController {
  constructor(private blogValidator: BlogValidator) {}

  @Get(':blogId')
  async getBlog(@Param('blogId') blogId: string) {
    const blog = await this.blogValidator.validateBlogExists(blogId);
    return blog;
  }
}
```

### Step 3: Multiple Validators Example

**Before:**
```typescript
import { ValidateEntity } from 'src/modules/shared/validation/validate-entity.provider';

@Injectable()
export class BlogService {
  constructor(private validateEntity: ValidateEntity) {}

  async updateBlog(blogId: string, userId: string, data: UpdateBlogDto) {
    // Validation
    const blog = await this.validateEntity.validateUserIsBlogOwner(blogId, userId);
    const space = await this.validateEntity.validateSpaceExists(blog.spaceId);
    
    // Update logic
    return await this.blogRepository.save({ ...blog, ...data });
  }
}
```

**After:**
```typescript
import { BlogValidator, SpaceValidator } from 'src/modules/shared/validation/validators';

@Injectable()
export class BlogService {
  constructor(
    private blogValidator: BlogValidator,
    private spaceValidator: SpaceValidator,
  ) {}

  async updateBlog(blogId: string, userId: string, data: UpdateBlogDto) {
    // Validation
    const blog = await this.blogValidator.validateUserIsBlogOwner(blogId, userId);
    const space = await this.spaceValidator.validateSpaceExists(blog.spaceId);
    
    // Update logic
    return await this.blogRepository.save({ ...blog, ...data });
  }
}
```

## Common Migration Patterns

### Pattern 1: Simple Existence Check
```typescript
// Before
await this.validateEntity.validateUserExists(userId);

// After
await this.userValidator.validateUserExists(userId);
```

### Pattern 2: Access Control
```typescript
// Before
await this.validateEntity.validateUserIsBlogOwner(blogId, userId);

// After
await this.blogValidator.validateUserIsBlogOwner(blogId, userId);
```

### Pattern 3: Loading Relations
```typescript
// Before
const blog = await this.validateEntity.validateBlogWithSpace(blogId);

// After
const blog = await this.blogValidator.validateBlogWithSpace(blogId);
```

### Pattern 4: Space Membership
```typescript
// Before
await this.validateEntity.validateUserIsSpaceMember(spaceId, userId);

// After
await this.memberValidator.validateUserIsSpaceMember(spaceId, userId);
```

### Pattern 5: Like Uniqueness
```typescript
// Before
await this.validateEntity.validateLikeDoesNotExist(blogId, userId);

// After
await this.likeValidator.validateLikeDoesNotExist(blogId, userId);
```

## Error Handling (No Changes)

All validators throw the same exceptions as before:

```typescript
try {
  await this.blogValidator.validateBlogExists(blogId);
} catch (error) {
  if (error instanceof NotFoundException) {
    // Handle not found
  }
  if (error instanceof ForbiddenException) {
    // Handle forbidden
  }
  if (error instanceof ConflictException) {
    // Handle conflict
  }
}
```

## Testing Benefits

With individual validators, testing is now easier:

**Before:**
```typescript
// Hard to test - ValidateEntity has all validators
const validateEntity = new ValidateEntity(
  blogRepo, likeRepo, spaceRepo, userRepo, memberRepo
);
```

**After:**
```typescript
// Easy to test - Only what you need
const blogValidator = new BlogValidator(blogRepo, memberRepo);
```

## Gradual Migration

You don't need to migrate everything at once:

```typescript
// Both work together during migration
@Injectable()
export class BlogService {
  constructor(
    private validateEntity: ValidateEntity, // Old way (deprecated)
    private blogValidator: BlogValidator,  // New way
  ) {}

  // New methods use individual validators
  async getBlog(blogId: string) {
    return this.blogValidator.validateBlogExists(blogId);
  }

  // Old methods still work with ValidateEntity
  async getLegacyBlog(blogId: string) {
    return this.validateEntity.validateBlogExists(blogId);
  }
}
```

## Deprecation Timeline

1. **Phase 1 (Now)** - New code uses individual validators
2. **Phase 2 (v2.0)** - ValidateEntity marked as `@deprecated()`
3. **Phase 3 (v3.0)** - ValidateEntity removed

## Summary of Changes

| Aspect | Old | New |
|--------|-----|-----|
| **Injection** | 1 service (ValidateEntity) | Multiple specific validators |
| **Testability** | Difficult | Easy |
| **Type Safety** | Generic | Fully typed with generics |
| **Maintainability** | Monolithic | Modular |
| **Scalability** | Limited | Extensible |
| **Error Handling** | Same exceptions | Same exceptions |
| **Learning Curve** | Steeper | Gentler |

## Questions?

Refer to:
- `VALIDATORS.md` - Full documentation
- `VALIDATORS_REFERENCE.md` - Quick reference
- `ARCHITECTURE_SUMMARY.md` - Architecture details
