# GitHub Configuration

This directory contains GitHub-specific configuration files and documentation for the 星云操作系统 (Nebula OS) project.

## 📁 Contents

### Issue Templates (`ISSUE_TEMPLATE/`)

GitHub issue templates to help contributors create well-structured issues:

- **`bug_report.md`**: Template for reporting bugs
- **`feature_request.md`**: Template for requesting new features
- **`copilot-enhancement.md`**: Template for proposing enhancements to Copilot instructions
- **`config.yml`**: Configuration for issue template selection screen

### Workflows (`workflows/`)

GitHub Actions CI/CD workflows:

- **`ci.yml`**: Continuous Integration workflow for linting, type checking, and building

### Documentation

- **`copilot-instructions.md`**: Comprehensive instructions for GitHub Copilot agent
- **`COPILOT_ENHANCEMENTS.md`**: Tracking document for Copilot instruction enhancements
- **`SUB_ISSUE_8.md`**: Sub-issue documentation for issue #8 - Infrastructure overview

## 🤖 Copilot Instructions

The `copilot-instructions.md` file provides comprehensive guidance to GitHub Copilot for working on this project. It includes:

- Project overview and technical stack
- Code standards and best practices
- Project structure and organization
- Core functionality modules
- Git workflow and branch strategy
- Security best practices
- Testing strategy
- Development workflow

### Enhancing Copilot Instructions

To propose improvements to the Copilot instructions:

1. Create a new issue using the "Copilot Enhancement" template
2. Reference the tracking document: `COPILOT_ENHANCEMENTS.md`
3. Submit a PR with your proposed changes
4. Link your PR to issue #8

## 📝 Issue Templates Usage

When creating a new issue, GitHub will present you with template options:

- **Bug Report**: For reporting issues with existing functionality
- **Feature Request**: For proposing new features or improvements
- **Copilot Enhancement**: For suggesting improvements to AI assistant instructions
- **Blank Issue**: For general issues that don't fit other templates

## 🔄 Workflows

### CI Workflow

The CI workflow automatically runs on:
- Push to `main` branch
- Pull requests targeting `main` branch

It performs:
- ESLint code quality checks
- TypeScript type checking
- Production build verification
- Permission validation

## 📚 Related Documentation

- [README.md](../README.md) - Project overview and setup
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](../SECURITY.md) - Security policies

## 🔗 Issue Tracking

**Issue #8**: Set up Copilot instructions (Completed)
- Initial setup of Copilot instructions for the repository
- Sub-issues and enhancements tracked in `COPILOT_ENHANCEMENTS.md`

---

**Maintained by**: @YYC-Cube  
**Last Updated**: 2026-01-28
