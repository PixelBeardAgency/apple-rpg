# Contributing to RPG Todo

This is currently a personal project being developed as part of an evaluation. External contributions are not being accepted at this time.

## Development Workflow

1. All features follow the implementation plan in `/docs/implementation-plan.md`
2. Critical requirements are documented in `/docs/project-memory.md`
3. Development follows a phased approach (see implementation plan)

## Code Standards

- Follow existing code style and patterns
- Write clear, descriptive commit messages
- Test all critical paths before committing
- Update documentation when adding features
- Follow the project's critical requirements (MUST DO / MUST NOT DO)

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat(tasks): add XP calculation for task completion

Implement XP awarding based on priority levels:
- High priority: 100 XP
- Medium priority: 50 XP
- Low priority: 25 XP

Closes #12
```

## Project Structure

```
rpg-todo/
├── docs/              # All project documentation
├── frontend/          # React application
├── backend/           # Express.js API
└── package.json       # Root workspace config
```

## Development Phases

The project is developed in 5 phases:
1. **Phase 1**: Foundation & Database
2. **Phase 2**: Core Features (Auth, Tasks, XP)
3. **Phase 3**: Achievements & Labels
4. **Phase 4**: UI Polish & Tutorial
5. **Phase 5**: Deployment Preparation

See `/docs/implementation-plan.md` for detailed phase breakdown.

## Questions?

Refer to `/docs/qa-log.md` for common questions and answers about the project.

## Critical Requirements

Before submitting any code, ensure it adheres to the critical requirements in `/docs/project-memory.md`:
- ✅ Exponential XP progression (not linear)
- ✅ Fixed XP values (100/50/25)
- ✅ 10 achievements with bonus XP
- ✅ Progress bars in BOTH header AND profile
- ✅ ALL achievements visible from start
- ✅ Unlimited custom labels
- And more...

---

Thank you for your interest in RPG Todo!

