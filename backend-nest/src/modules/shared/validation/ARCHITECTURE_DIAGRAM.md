```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    VALIDATION SYSTEM ARCHITECTURE                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                         BaseValidator<T extends ObjectLiteral>              │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ # repository: Repository<T>                                           │ │
│  │                                                                        │ │
│  │ + validateExists(id, errorMessage?): Promise<T>                       │ │
│  │ + validateExistsWithRelations(id, relations, errorMessage?): Promise<T> │ │
│  │ + validateExistsWhere(where, errorMessage?): Promise<T>              │ │
│  │ # getEntityName(): string                                             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      △
                                      │ inherits
                    ┌─────────────────┴─────────────────┐
                    │                                   │
        
┌───────────────────────────────┐    ┌──────────────────────────────────┐
│   UserValidator               │    │   BlogValidator                  │
├───────────────────────────────┤    ├──────────────────────────────────┤
│ # userRepository              │    │ # blogRepository                 │
│                               │    │ # memberRepository               │
│ + validateUserExists()        │    │                                  │
└───────────────────────────────┘    │ + validateBlogExists()           │
                                      │ + validateBlogWithSpace()        │
                                      │ + validateBlogWithSpaceAndUser() │
                                      │ + validateUserIsBlogOwner()      │
                                      │ + validateUserCanAccessBlog()    │
                                      │ + validateUserCanAccessPrivate() │
                                      └──────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐
│  SpaceValidator          │  │  CommentValidator        │  │  LikeValidator  │
├──────────────────────────┤  ├──────────────────────────┤  ├─────────────────┤
│ + validateSpaceExists()  │  │ + validateCommentExists()│  │ + validateLike  │
│                          │  │ + validateCommentWith    │  │   DoesNotExist()│
│                          │  │   Relations()            │  │ + validateLike  │
│                          │  │                          │  │   Exists()      │
└──────────────────────────┘  └──────────────────────────┘  └─────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐
│  MemberValidator         │  │  ChatValidator           │  │  TagValidator   │
├──────────────────────────┤  ├──────────────────────────┤  ├─────────────────┤
│ + validateMember        │  │ + validateChatMessage    │  │ + validateTag   │
│   Exists()              │  │   Exists()               │  │   Exists()      │
│ + validateUserIsSpace    │  │ + validateConversation   │  │                 │
│   Member()              │  │   Exists()               │  │                 │
│ + checkMembership()     │  │                          │  │                 │
└──────────────────────────┘  └──────────────────────────┘  └─────────────────┘

┌─────────────────────────────┐
│  NotificationValidator      │
├─────────────────────────────┤
│ + validateNotification      │
│   Exists()                  │
└─────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════╗
║                        MODULE EXPORTS & INJECTION                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

ValidationModule
├── Providers
│   ├── ValidateEntity (legacy, maintained for compatibility)
│   ├── UserValidator
│   ├── BlogValidator
│   ├── SpaceValidator
│   ├── CommentValidator
│   ├── LikeValidator
│   ├── MemberValidator
│   ├── ChatValidator
│   ├── TagValidator
│   └── NotificationValidator
│
└── Exports (same as providers)


╔══════════════════════════════════════════════════════════════════════════════╗
║                         USAGE IN SERVICES/CONTROLLERS                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

@Controller('blogs')
export class BlogController {
  constructor(
    private blogValidator: BlogValidator,      ← Injected
    private userValidator: UserValidator,      ← Injected
    private spaceValidator: SpaceValidator,    ← Injected
  ) {}

  @Get(':blogId')
  async getBlog(@Param('blogId') blogId: string) {
    // Type-safe validation returns Blog entity
    const blog = await this.blogValidator.validateBlogExists(blogId);
    return blog;
  }
}


╔══════════════════════════════════════════════════════════════════════════════╗
║                            ERROR HANDLING FLOW                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

validateBlogExists()
    ↓
  Exists? ─ YES → return Blog
    ↓ NO
  NotFoundException
    ↓
  Global Exception Filter
    ↓
  404 Response


validateUserIsBlogOwner()
    ↓
  Blog Exists? ─ NO → NotFoundException
    ↓ YES
  User owns? ─ NO → ForbiddenException
    ↓ YES
  return Blog


validateLikeDoesNotExist()
    ↓
  Like Exists? ─ YES → ConflictException
    ↓ NO
  return void (continue)


╔══════════════════════════════════════════════════════════════════════════════╗
║                        TYPE SAFETY EXAMPLE                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

// All validators are fully typed
const blog: Blog = await this.blogValidator.validateBlogExists(blogId);
                                                                  ↑
                                    TypeScript knows this must be a Blog


// Relations are properly typed
const blogWithSpace: Blog = await this.blogValidator
  .validateBlogWithSpace(blogId);
                         ↑
    TypeScript knows blog.space is loaded (no undefined)


// Generic base class ensures type safety
class BlogValidator extends BaseValidator<Blog> {
  // All repository operations are typed to Blog
  // No type casting needed
}
```

## Key Benefits of This Architecture

| Feature | Benefit |
|---------|---------|
| **Inheritance** | Shared validation logic in base class |
| **Generics** | Type-safe entities returned |
| **Single Responsibility** | Each validator handles one entity type |
| **Dependency Injection** | Easy testing and modularity |
| **Extensibility** | Easy to add new validators for new entities |
| **Clear Contracts** | Method signatures document requirements |
| **Error Handling** | Consistent exception types |

## File Organization

```
shared/validation/
├── base.validator.ts              ← Base abstract class
├── validate-entity.provider.ts    ← Legacy provider (deprecated)
├── validation.module.ts           ← Module with all providers
├── validators/
│   ├── index.ts                   ← Central exports
│   ├── user.validator.ts
│   ├── blog.validator.ts
│   ├── space.validator.ts
│   ├── comment.validator.ts
│   ├── like.validator.ts
│   ├── member.validator.ts
│   ├── chat.validator.ts
│   ├── tag.validator.ts
│   └── notification.validator.ts
├── VALIDATORS.md                  ← Full documentation
├── VALIDATORS_REFERENCE.md        ← Quick reference
├── ARCHITECTURE_SUMMARY.md        ← Architecture overview
└── MIGRATION_GUIDE.md             ← Migration from old system
```
