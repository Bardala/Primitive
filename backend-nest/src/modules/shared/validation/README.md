# Entity Validation System

A comprehensive, type-safe validation system built with OOP best practices for checking entity existence and returning typed entity instances.

## 🎯 Overview

This validation system provides individual validators for each entity in the application. Each validator:
- ✅ Checks if an entity exists
- ✅ Returns the entity instance (properly typed)
- ✅ Throws appropriate exceptions on validation failure
- ✅ Supports loading relations
- ✅ Implements business logic (ownership, access control, etc.)

## 📁 Structure

```
validation/
├── base.validator.ts              # Abstract base class for all validators
├── validation.module.ts           # NestJS module exporting all validators
├── validators/                    # Individual validators directory
│   ├── user.validator.ts
│   ├── blog.validator.ts
│   ├── space.validator.ts
│   ├── comment.validator.ts
│   ├── like.validator.ts
│   ├── member.validator.ts
│   ├── chat.validator.ts
│   ├── tag.validator.ts
│   ├── notification.validator.ts
│   └── index.ts                  # Central export file
├── VALIDATORS.md                 # Full documentation
├── VALIDATORS_REFERENCE.md       # Quick reference
├── ARCHITECTURE_SUMMARY.md       # Architecture overview
├── ARCHITECTURE_DIAGRAM.md       # Visual diagrams
└── MIGRATION_GUIDE.md            # Migration from old system
```

## 🚀 Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { ValidationModule } from 'src/modules/shared/validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [YourController],
  providers: [YourService],
})
export class YourModule {}
```

### 2. Inject Validators

```typescript
import { BlogValidator, UserValidator } from 'src/modules/shared/validation/validators';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogValidator: BlogValidator,
    private readonly userValidator: UserValidator,
  ) {}
}
```

### 3. Use in Your Code

```typescript
@Get(':blogId')
async getBlog(@Param('blogId') blogId: string) {
  // Validates blog exists, returns typed Blog instance
  const blog = await this.blogValidator.validateBlogExists(blogId);
  return blog;
}

@Put(':blogId')
async updateBlog(@Param('blogId') blogId: string, @Req() req: any) {
  // Validates user is blog owner
  const blog = await this.blogValidator.validateUserIsBlogOwner(
    blogId,
    req.user.id,
  );
  // Update logic...
  return blog;
}
```

## 📚 Available Validators

| Validator | Purpose | Key Methods |
|-----------|---------|------------|
| **UserValidator** | User entity validation | `validateUserExists()` |
| **BlogValidator** | Blog with access control | `validateBlogExists()`, `validateUserIsBlogOwner()`, `validateUserCanAccessBlog()` |
| **SpaceValidator** | Space entity validation | `validateSpaceExists()` |
| **CommentValidator** | Comment validation | `validateCommentExists()`, `validateCommentWithRelations()` |
| **LikeValidator** | Like uniqueness validation | `validateLikeExists()`, `validateLikeDoesNotExist()` |
| **MemberValidator** | Member & membership validation | `validateMemberExists()`, `validateUserIsSpaceMember()` |
| **ChatValidator** | Chat entities validation | `validateChatMessageExists()`, `validateConversationExists()` |
| **TagValidator** | Tag entity validation | `validateTagExists()` |
| **NotificationValidator** | Notification validation | `validateNotificationExists()` |

## 🏛️ Architecture

### Base Validator Class

All validators inherit from `BaseValidator<T>`, which provides:

```typescript
// Basic validation
validateExists(id: string, errorMessage?: string): Promise<T>

// Validation with relations
validateExistsWithRelations(
  id: string,
  relations: string[],
  errorMessage?: string
): Promise<T>

// Validation with custom query
validateExistsWhere(where: any, errorMessage?: string): Promise<T>
```

### Example: BlogValidator

```typescript
@Injectable()
export class BlogValidator extends BaseValidator<Blog> {
  // Uses base class methods
  async validateBlogExists(blogId: string): Promise<Blog> {
    return this.validateExists(blogId, 'Blog not found');
  }

  // Custom business logic
  async validateUserIsBlogOwner(
    blogId: string,
    userId: string,
  ): Promise<Blog> {
    const blog = await this.validateBlogExists(blogId);
    if (blog.userId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }
    return blog;
  }
}
```

## ⚠️ Exception Handling

Validators throw appropriate NestJS exceptions:

```typescript
// Entity not found
throw new NotFoundException('Blog not found');

// Access denied
throw new ForbiddenException('This blog is in a private space');

// Conflict/duplicate
throw new ConflictException('Already liked');
```

## 💡 Usage Patterns

### Pattern 1: Simple Existence Check
```typescript
const user = await this.userValidator.validateUserExists(userId);
```

### Pattern 2: With Relations
```typescript
const blog = await this.blogValidator.validateBlogWithSpace(blogId);
// blog.space is loaded and typed
```

### Pattern 3: Access Control
```typescript
const blog = await this.blogValidator.validateUserIsBlogOwner(
  blogId,
  userId,
);
```

### Pattern 4: Membership Verification
```typescript
await this.memberValidator.validateUserIsSpaceMember(spaceId, userId);
```

### Pattern 5: Uniqueness Checks
```typescript
// Ensure like doesn't exist before creating
await this.likeValidator.validateLikeDoesNotExist(blogId, userId);

// Verify like exists before deleting
const like = await this.likeValidator.validateLikeExists(blogId, userId);
```

## 🔄 Migration from Old System

The old `ValidateEntity` provider still works but is maintained for backward compatibility only.

**Before:**
```typescript
constructor(private validateEntity: ValidateEntity) {}
// Usage
await this.validateEntity.validateBlogExists(blogId);
```

**After:**
```typescript
constructor(private blogValidator: BlogValidator) {}
// Usage
await this.blogValidator.validateBlogExists(blogId);
```

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## 📖 Documentation

- **`VALIDATORS.md`** - Comprehensive guide with all methods and examples
- **`VALIDATORS_REFERENCE.md`** - Quick reference of all validators and methods
- **`ARCHITECTURE_SUMMARY.md`** - Architecture overview and OOP practices
- **`ARCHITECTURE_DIAGRAM.md`** - Visual architecture diagrams
- **`MIGRATION_GUIDE.md`** - Step-by-step migration guide

## ✨ OOP Best Practices Applied

✅ **Abstraction** - Common logic abstracted in `BaseValidator`
✅ **Inheritance** - Each validator extends `BaseValidator`
✅ **Encapsulation** - Protected and private members
✅ **Single Responsibility** - One validator per entity
✅ **Polymorphism** - Overridable `getEntityName()` method
✅ **Dependency Injection** - NestJS DI pattern
✅ **Type Safety** - Generics ensure compile-time safety
✅ **DRY** - No code duplication

## 🧪 Testing

Individual validators are easy to unit test:

```typescript
describe('BlogValidator', () => {
  let validator: BlogValidator;
  let blogRepository: Repository<Blog>;

  beforeEach(async () => {
    blogRepository = createMock<Repository<Blog>>();
    validator = new BlogValidator(blogRepository, memberRepository);
  });

  it('should validate blog exists', async () => {
    const blog = { id: '123', title: 'Test' };
    blogRepository.findOne.mockResolvedValue(blog);

    const result = await validator.validateBlogExists('123');
    expect(result).toEqual(blog);
  });
});
```

## 🔧 Adding New Validators

To add a validator for a new entity:

1. Create a new file in `validators/` directory:
```typescript
// validators/my-entity.validator.ts
import { Injectable } from '@nestjs/common';
import { BaseValidator } from '../base.validator';

@Injectable()
export class MyEntityValidator extends BaseValidator<MyEntity> {
  constructor(
    @InjectRepository(MyEntity)
    repository: Repository<MyEntity>,
  ) {
    super(repository);
  }

  async validateMyEntityExists(id: string): Promise<MyEntity> {
    return this.validateExists(id, 'My entity not found');
  }
}
```

2. Export from `validators/index.ts`
3. Add to `validation.module.ts`
4. Add to documentation

## 📊 Benefits Summary

| Aspect | Benefit |
|--------|---------|
| **Type Safety** | Full TypeScript support with generics |
| **Modularity** | Each validator is independent |
| **Reusability** | Base class eliminates code duplication |
| **Testability** | Easy to unit test individual validators |
| **Maintainability** | Clear structure and responsibility |
| **Scalability** | Easy to add new validators |
| **Error Handling** | Consistent exception types |
| **Documentation** | Self-documenting method signatures |

## 🤝 Contributing

When adding new entity validators:
1. Extend `BaseValidator<Entity>`
2. Implement entity-specific validation logic
3. Add proper error handling with meaningful messages
4. Update documentation
5. Add unit tests

## 📝 License

This validation system is part of the Nest application migration project.

## 🔗 Related Files

- `src/modules/shared/validation/base.validator.ts` - Base class
- `src/modules/shared/validation/validation.module.ts` - Module configuration
- `src/modules/shared/validation/validate-entity.provider.ts` - Legacy provider

---

For more details, see the documentation files listed above.
