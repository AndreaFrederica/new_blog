# Mozilla Public License 2.0 (MPL 2.0)

## Overview

The Mozilla Public License (MPL) is an open source software license developed by the Mozilla Foundation that balances the characteristics of copyleft and permissive licenses.

**Version:** 2.0, January 3, 2012  
**Official URL:** https://www.mozilla.org/en-US/MPL/2.0/

## Core Features

MPL 2.0 is a **file-level copyleft** license, which means:

- Modifications to MPL-licensed files must continue to use the MPL license
- Can be combined with code under other licenses
- More permissive than GPL, stricter than MIT/BSD

## What You Can Do

### ✅ Use & Distribution

- **Commercial Use** - Can be used in commercial products
- **Distribution** - Can distribute in source or binary form
- **Modification** - Can modify MPL-licensed code
- **Combination** - Can combine with code under other licenses

### ✅ Patent Protection

- **Patent License** - Automatic patent license from contributors
- **Patent Retaliation** - Your license terminates if you sue anyone for patent infringement

### ✅ Relicensing

Under certain conditions, MPL code can be relicensed as:

- **GPL 2.0+** - If file header includes compatibility statement
- **LGPL 2.1+** - If file header includes compatibility statement
- **AGPL 3.0+** - If file header includes compatibility statement

## Obligations and Requirements

### 📝 Source Code Disclosure

- **Modified MPL Files** - Must release source code under MPL 2.0
- **Only Modified Files** - Only need to release source for modified MPL files
- **Other Files Unaffected** - Proprietary code can remain proprietary

### 📋 Information to Preserve

- **License Headers** - Each MPL file must retain license header
- **Copyright Notices** - Preserve all copyright and license notices
- **Change Records** - Document significant modifications to files

### 🔄 Distribution Requirements

When distributing software containing MPL code:

- **Source Availability** - Ensure source code of MPL files is available
- **License Notice** - Include MPL license text
- **Change Description** - Describe modifications to MPL files

## Compatibility with Other Licenses

### ✅ Compatible Licenses

Can be combined with:

- **MIT/BSD** - Permissive licenses
- **Apache 2.0** - Similar patent clauses
- **Proprietary Licenses** - In separate files

### 🔄 Conditionally Compatible

- **GPL 2.0+** - Requires compatibility statement
- **LGPL 2.1+** - Requires compatibility statement
- **AGPL 3.0+** - Requires compatibility statement

### ❌ Incompatible Licenses

- **GPL 2.0** (only) - Without "or later" clause
- **Some Proprietary Licenses** - May have conflicting terms

## File-Level Copyleft Implications

### 📁 File-Level Rules

- **Individual Files** - Each file considered independently for licensing
- **Modified Files** - Modified MPL files must remain MPL-licensed
- **New Files** - Newly added files can use different licenses

### 🔗 Linking and Combination

- **Static Linking** - Allowed with proprietary code
- **Dynamic Linking** - Allowed with proprietary code
- **Same Executable** - MPL and proprietary code can be in same program

## Patent Clauses

### ⚖️ Patent License

- **Automatic Grant** - Contributors automatically grant patent license
- **Scope** - Limited to patents necessary for their contributions
- **Defensive** - Protects users from patent litigation

### 🛡️ Patent Retaliation

If you initiate patent litigation against anyone claiming MPL-licensed software infringes patents:

- Your MPL license **immediately terminates**
- Applies to all MPL 2.0 licensed software, not just the sued software

## Practical Use Cases

### ✅ Projects Suitable for MPL 2.0

- **Libraries and Frameworks** - Can be used by proprietary software
- **Development Tools** - Compilers, editors, etc.
- **Enterprise Software Components** - Need business-friendly copyleft
- **Mixed-License Projects** - Partially open source, partially proprietary

### ⚠️ Scenarios to Consider

- **Pure Open Source Projects** - GPL might be more appropriate
- **Simple Tools** - MIT/BSD might be simpler
- **Web Services** - AGPL might better prevent service circumvention

## Compliance Guidelines

### 📦 When Distributing Binaries

1. **Include License Text** - Complete MPL 2.0 text
2. **List MPL Files** - Indicate which files use MPL license
3. **Provide Source Code** - Ensure source code of MPL files is available
4. **Preserve Notices** - Keep all copyright and license notices

### 💻 When Distributing Source Code

1. **Retain File Headers** - License header in each MPL file
2. **Include License** - Complete MPL 2.0 text
3. **Mark Modifications** - Clearly indicate modifications to files

### 🔧 When Modifying MPL Files

1. **Maintain MPL License** - Modified files must remain MPL 2.0
2. **Add Copyright** - Add copyright notice for significant modifications
3. **Record Changes** - Document modifications in file or changelog

## Relationship with Other Mozilla Projects

### 🦊 Firefox

Firefox uses MPL 2.0, allowing:

- Commercial distributions (like enterprise versions)
- Proprietary extensions and plugins
- Embedding in proprietary products

### 📧 Thunderbird

Similarly, Thunderbird's MPL licensing allows commercial use and customization.

## Frequently Asked Questions

**Q: Can I use MPL libraries in proprietary software?**
A: Yes, but you must maintain the copyleft nature of MPL files and provide source code for those files.

**Q: If I modify an MPL file, must the entire project be open source?**
A: No, only the modified MPL files need to be open source; other files can remain proprietary.

**Q: What's the main difference between MPL and GPL?**
A: MPL is file-level copyleft, GPL is project-level copyleft. MPL allows easier combination with proprietary code.

**Q: Do I need to pay licensing fees for using MPL libraries?**
A: No, MPL is a free open source license.

## Best Practices

### 📋 License Management

- **Maintain Inventory** - Track all MPL files
- **Automated Checking** - Use tools to verify license compliance
- **Train Team** - Ensure developers understand MPL requirements

### 🔍 Code Review

- **Check New Files** - Ensure proper license headers
- **Verify Modifications** - Ensure modified MPL files remain compliant
- **Document Decisions** - Record reasons for license choices

## Legal Notice

This document is a simplified explanation of MPL 2.0 and has no legal force. Please read the complete license text carefully before use.

The Mozilla Foundation is not a law firm and does not provide legal services. Distributing, displaying, or linking to this summary does not create a lawyer-client relationship.
