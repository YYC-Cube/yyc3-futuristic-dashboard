module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // Bug修复
        'docs',     // 文档更新
        'style',    // 代码格式（不影响功能）
        'refactor', // 重构（非新功能、非Bug修复）
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建系统或依赖变更
        'ci',       // CI配置变更
        'chore',    // 杂项（不改变源码或测试）
        'revert',   // 回滚提交
      ],
    ],
    'subject-case': [0], // 不强制主题大小写
    'subject-max-length': [2, 'always', 100],
  },
}
