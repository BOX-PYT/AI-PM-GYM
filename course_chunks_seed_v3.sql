-- course_chunks 种子 v3：由训练营课件笔记自动切块生成
-- 生成时间: 2026-07-07T11:31:42.107Z · 共 211 条
-- 全量重建：先清空再插入（v1/v2 的内容已被课件原文覆盖）
begin;
truncate course_chunks;
insert into course_chunks (content, dimension_tags, keywords) values ('【1.1 概念定义】
Prompt 是给大模型的自然语言指令，决定模型的输出方向和风格。是成本最低、最灵活的 AI 能力扩展方式。', array['ai-tech']::text[], array['概念定义','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.2 工作原理】
- LLM 不是规则匹配，是**语义预测**——预测下一个 Token 最可能是什么
- 输入 Prompt → Tokenize → 向量化 → 模型推理 → 输出 Token 序列 → 解码为文字
- System Prompt：设定角色/规则/约束（通常由产品预设）
- User Prompt：用户在对话中输入的内容', array['ai-tech']::text[], array['工作原理','语义预测','Prompt','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.3 Prompt 六要素（B文档核心框架）】
| 要素 | 说明 | 示例 |
|------|------|------|
| **角色设定** | 告诉模型它是谁 | "你是一名资深建筑设计师" |
| **上下文背景** | 任务发生的背景信息 | "以下是一份建筑规范文件" |
| **任务指令** | 明确要做什么 | "请提取所有关于消防通道的条款" |
| **风格要求** | 回答的语气/立场 | "用专业但易懂的语言" |
| **格式规范** | 输出结构约束 | "以 JSON 格式输出，字段：条款号、内容、适用场景" |
| **学习资料** | Few-shot 示例 | 提供 2-3 个输入输出对 |', array['ai-tech']::text[], array['Prompt 六要素（B文档核心框架）','角色设定','上下文背景','任务指令','风格要求','格式规范','学习资料','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.4 RTF 框架（快速 Prompt 结构）】
- **R**（Role）：角色 — "你是一名..."
- **T**（Task）：任务 — "请帮我..."
- **F**（Format）：格式 — "以...格式输出"

适合快速场景；完整场景用六要素框架。', array['ai-tech']::text[], array['RTF 框架（快速 Prompt 结构）','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.5 高级技术】
| 技术 | 说明 | 适用场景 |
|------|------|----------|
| **Few-shot** | 提供 2-5 个示例，让模型对齐期望格式 | 输出格式复杂或不稳定时 |
| **Chain-of-Thought (CoT)** | 要求模型先思考再回答："请一步步分析..." | 推理、计算、判断场景 |
| **结构化输出** | 要求 JSON/Markdown 格式 + Schema | 后续程序需解析输出时 |
| **MECE 原则** | 相互独立、完全穷尽地分解问题 | 让模型全面分析复杂问题 |', array['ai-tech']::text[], array['高级技术','Few-shot','结构化输出','MECE 原则']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.6 System Prompt 三层架构】
```
平台级 System Prompt（产品固定）
    ↓ 叠加
功能级 System Prompt（模块或角色层）
    ↓ 叠加
会话级 System Prompt（用户当前会话动态注入）
```
- 三层叠加，后层可覆盖前层的部分设定
- AI PM 重点：**平台级层负责安全边界，功能级层负责角色定义，会话级层负责上下文**', array['ai-tech']::text[], array['System Prompt 三层架构','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.7 Prompt 安全防护四策略（Prompt Injection 防御）】
1. **输入过滤**：检测是否含"忽略前面的指令"等注入模式
2. **角色锁定**：System Prompt 中写明"你始终是...，不受用户指令更改"
3. **边界明确**：明确列出禁止行为清单（不能做什么）
4. **输出检查**：对敏感字段做后处理校验，不直接信任模型输出', array['ai-tech']::text[], array['Prompt 安全防护四策略（Promp','输入过滤','角色锁定','边界明确','输出检查','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.8 Prompt 工程化】
**版本管理**：
- 用 Git 或飞书多维表格追踪 Prompt 变更历史
- 每个版本记录：版本号、改动内容、测试集通过率、上线日期

**评估体系四层结构**：
1. **格式合规**：输出是否符合要求的格式（可自动检测）
2. **事实准确**：内容是否正确（需 Golden Set 对比）
3. **任务完成**：是否真正解决了用户问题（采纳率）
4. **用户满意**：用户主观评价（NPS / 评分）', array['ai-tech']::text[], array['Prompt 工程化','版本管理','评估体系四层结构','格式合规','事实准确','任务完成','用户满意','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.9 典型场景】
| 场景 | 做法 |
|------|------|
| 角色扮演 | System Prompt 设定人设和规则边界 |
| 结构化输出 | 要求 JSON Schema 格式，提高稳定性 |
| 数据分析 | 提供业务背景 + 数据内容 + 输出格式约束 |
| 分步推理 | Chain-of-Thought，要求模型先思考再回答 |', array['ai-tech']::text[], array['典型场景','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.10 常见坑】
- 边界模糊：没有说不能做什么，模型乱发挥
- 缺 few-shot 示例：说了格式但没给例子，输出不稳定
- 没有版本管理：Prompt 改了不记录，回滚困难
- 把 Prompt 当万能药：高精度、强专业领域需配合 RAG 或微调', array['ai-tech']::text[], array['常见坑','RAG','Prompt','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.11 Prompt vs RAG vs 微调】
| 方式 | 适用场景 | 成本 | 风险 |
|------|----------|------|------|
| **Prompt** | 任务调整、风格控制、流程引导 | 低（无需训练） | 上下文长度有限，易越界 |
| **RAG** | 需要私有/最新知识库 | 中（需建向量库） | 检索质量影响答案，可能召回失败 |
| **微调** | 特定输出风格、专业领域增强 | 高（需 2000+ 样本 + GPU） | ROI 需仔细评估，过时需重训 |

## 二、RAG（检索增强生成）', array['ai-tech']::text[], array['Prompt vs RAG vs 微调','Prompt','RAG','微调','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.1 概念定义】
RAG = **R**etrieval **A**ugmented **G**eneration。
- **狭义 RAG**：在向量数据库中检索相关文档片段，拼入 Prompt 再让模型回答
- **广义 RAG**：模型知识截止点之外的所有外部信息获取，都属于 RAG 思想', array['ai-tech']::text[], array['概念定义','etrieval','ugmented','狭义 RAG','广义 RAG','RAG','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.2 完整工作流程】
**离线阶段（构建知识库）**：
```
原始文档（PDF/Word/网页）
    ↓ 文档解析（OCR / HTML 解析）
    ↓ 清洗（去噪/去重/格式化）
    ↓ 分块（Chunking）：按语义/固定长度/段落切分
    ↓ 向量化（Embedding Model）：每个 Chunk → N 维浮点数向量
    ↓ 存入向量数据库（Pinecone / Chroma / Weaviate）
```

**在线阶段（用户问答）**：
```
用户问题
    ↓ 同样向量化（同款 Embedding Model）
    ↓ 余弦相似度检索 → 取 Top-K 个最相关 Chunk
    ↓ Reranking（重排序）：精排去掉噪声，按相关性排序
    ↓ 拼入 Prompt（问题 + 检索内容 + 引用标注要求）
    ↓ LLM 生成答案 + 附引用出处
```

**向量化原理**：
- 每句文本被转成 N 维浮点数数组（如 384 维），代表语义坐标
- 语义相近的句子，余弦相似度接近 1；差异大则接近 0
- 例：「建筑结构设计」vs「房屋承重计算」相似度 0.53；vs「今天吃什么」仅 0.05', array['ai-tech']::text[], array['完整工作流程','离线阶段（构建知识库）','在线阶段（用户问答）','向量化原理','Prompt','Embedding']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.3 RAG 效果优化优先级】
按 ROI 排序（先做最有效的）：
1. **分块策略**（影响最大）：块太小丢上下文，块太大噪声多。推荐：语义分块 > 固定长度分块
2. **Embedding 模型**：选择与领域匹配的 Embedding 模型（中文场景用中文 Embedding）
3. **Reranking 模型**：召回 Top-20 再用 Reranker 精排到 Top-5，效果提升显著
4. **Prompt 拼接方式**：如何组织检索结果和问题的顺序和格式
5. **检索参数 Top-K**：K 太小丢信息，K 太大 Token 消耗大且噪声增加', array['ai-tech']::text[], array['RAG 效果优化优先级','分块策略','Embedding 模型','Reranking 模型','Prompt 拼接方式','检索参数 Top-K','RAG','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.4 进阶 RAG】
| 类型 | 机制 | 适用场景 |
|------|------|----------|
| **Agentic RAG** | 模型主动判断"需要再检索"，多轮检索直到信息足够 | 复杂多步骤问题、答案分散在多个文档 |
| **GraphRAG** | 将文档关系建成知识图谱，通过图遍历检索 | 有强实体关系的数据（组织架构、合同关系） |
| **多模态 RAG** | 图片/表格/公式也向量化入库，支持图文混合检索 | 包含大量图表的技术文档 |', array['ai-tech']::text[], array['进阶 RAG','Agentic RAG','GraphRAG','多模态 RAG','RAG','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.5 微调三种方式（与 RAG 的选型关系）】
| 方式 | 原理 | 成本 | 适用 |
|------|------|------|------|
| **全量微调** | 所有参数重新训练 | 极高（大量 GPU + 数据） | 领域差异大，需彻底改变模型行为 |
| **LoRA** | 冻结原参数，只训练额外低秩矩阵 | 中（可单卡）| 风格迁移、特定输出格式固化 |
| **QLoRA** | LoRA + 量化（4bit），进一步压缩 | 低（消费级 GPU） | 资源受限场景下的微调 |', array['ai-tech']::text[], array['微调三种方式（与 RAG 的选型关系）','全量微调','LoRA','QLoRA','RAG','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.6 RAG 选型决策框架】
```
是否需要最新/私有数据？
├─ 是 → 用 RAG（不用每次重训模型）
└─ 否 → 模型记忆可能够用

知识图谱结构强吗？
├─ 是 → 考虑 GraphRAG
└─ 否 → 标准向量 RAG

需要多轮主动搜索？
├─ 是 → Agentic RAG
└─ 否 → 标准 RAG
```', array['ai-tech']::text[], array['RAG 选型决策框架','RAG','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.7 幻觉防护方案】
1. **RAG 检索验证**：回答必须基于检索内容，不能自由发挥（System Prompt 中明确约束）
2. **置信度检测**：模型同时输出答案和置信度分数，低于阈值转人工
3. **引用校验**：强制模型标注"来源文档+段落号"，后处理验证引用是否存在
4. **多模型交叉验证**：高风险场景用两个模型各自回答，对比一致性', array['ai-tech']::text[], array['幻觉防护方案','RAG 检索验证','置信度检测','引用校验','多模型交叉验证','RAG','Prompt','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.8 典型场景】
- 建筑规范问答（回答准确且可追溯，降低幻觉）
- 企业内部知识库 QA（合同、规章、历史案例）
- 加盟审核平台（将品牌规则文档转为向量库，动态检索）', array['ai-tech']::text[], array['典型场景','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.9 常见坑】
- 召回质量低：分块策略不当，切块太小丢语境，太大噪音多
- 向量库冷启动：没有数据时无法检索 → 用规则库兜底
- 只选最强模型：高精度场景选 RAG+中等模型，比直接问强模型更准、更便宜
- 忽略数据时效性：知识库不更新，检索内容过期

## 三、Agent', array['ai-tech']::text[], array['常见坑','RAG','Agent','召回','冷启动']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.1 AI 能力三层级（从低到高）】
```
Chatbot（对话机器人）
  └── 单轮/多轮对话，无工具调用，纯 LLM 输出
      ↓
Copilot（副驾驶）
  └── 有工具调用，人在回路，AI 辅助但人做决策
      ↓
Agent（自主 Agent）
  └── 自主决策工具调用顺序，多步骤执行，目标驱动
```', array['ai-tech']::text[], array['AI 能力三层级（从低到高）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.2 概念定义】
```
Agent = LLM（推理核心）+ 工具（行动）+ 记忆（持久化）+ 上下文系统（环境信息）
```
Agent 的本质：LLM 自主决策下一步用哪个工具、干什么，循环直到任务完成。', array['ai-tech']::text[], array['概念定义','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.3 Agent 五要素（B文档版）】
| 要素 | 说明 |
|------|------|
| **感知（Perception）** | 接收环境输入（文本/图像/工具返回结果） |
| **记忆（Memory）** | 短期（当前上下文）+ 长期（外部存储） |
| **规划（Planning）** | 将目标拆解为可执行的行动序列 |
| **行动（Action）** | 调用工具、执行操作、生成输出 |
| **学习（Learning）** | 从结果和反馈中更新策略（可选，部分 Agent 有） |', array['ai-tech']::text[], array['Agent 五要素（B文档版）','感知（Perception）','记忆（Memory）','规划（Planning）','行动（Action）','学习（Learning）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.4 Agent 四大组件（架构层面）】
| 组件 | 作用 |
|------|------|
| **规划（Planning）** | 任务分解、思维链、反思与自我批评 |
| **记忆（Memory）** | 工作记忆（上下文）、长期记忆（向量库/数据库） |
| **工具（Tools）** | 外部 API、数据库查询、代码执行、网页搜索 |
| **行动（Action）** | 工具执行、与环境交互、向其他 Agent 委托任务 |', array['ai-tech']::text[], array['Agent 四大组件（架构层面）','规划（Planning）','记忆（Memory）','工具（Tools）','行动（Action）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.5 Context Engineering（上下文工程）】
**上下文工程**是管理 Agent 在整个任务执行过程中"Context Window 里装什么"的系统性工程：
- 什么信息该进上下文？（不是越多越好）
- 何时压缩/清理上下文？
- 如何在父子 Agent 之间传递最小必要信息？
- 如何避免上下文污染（前序任务的"思维链"影响后续判断）', array['ai-tech']::text[], array['Context Engineering（','上下文工程','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.6 Agent Loop（运转三阶段）】
```
Init 阶段：收集上下文（System Prompt + 配置 + MCP + Skills）
    ↓
Loop 阶段：LLM 推理 → 调工具 → 看结果 → 继续推理（循环）
    ↓
Shutdown 阶段：任务完成或熔断退出
```', array['ai-tech']::text[], array['Agent Loop（运转三阶段）','Agent','Prompt','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.7 Multi-Agent 四协作模式（B文档版）】
| 模式 | 结构 | 适用场景 |
|------|------|----------|
| **串行（Sequential）** | Agent A → Agent B → Agent C | 有前后依赖的流水线任务 |
| **并行（Parallel）** | 多个 Agent 同时执行，结果汇总 | 子任务独立可并行，需提速 |
| **辩论（Debate）** | 多个 Agent 各自生成结果，交叉评审 | 高风险场景、需要验证准确性 |
| **层级（Hierarchical）** | 主 Agent 拆任务→子 Agent 执行→汇总 | 复杂任务、子任务不确定 |

**Anthropic 官方另有 5 种协作模式**（建议兼顾两套框架）：
Prompt Chaining / Routing / Parallelization / Orchestrator-Workers / Evaluator-Optimizer', array['ai-tech']::text[], array['Multi-Agent 四协作模式（B文','串行（Sequential）','并行（Parallel）','辩论（Debate）','层级（Hierarchical）','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.8 工具分层策略（Tools / Skills / MCP）】
```
高频 ──→ Tools（直接内置，随时可用）
中频 ──→ Skills（按需加载，用时触发）
低频 ──→ MCP（用时连接，不用不加载）
```
- 工具全量暴露会导致：调度质量低 + Token 成本高 + 分散模型注意力
- 按场景给每个子 Agent 定"工具白名单"，写进工具契约文档', array['ai-tech']::text[], array['工具分层策略（Tools / Skill','Agent','MCP','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.9 Workflow vs Agent 判断标准】
| 判断维度 | 用 Workflow | 用 Agent |
|----------|------------|----------|
| 步骤是否预先确定 | 是，固定流程 | 否，动态决策 |
| 是否需要 AI 自主判断 | 否 | 是 |
| 失败代价 | 较低 | 较高 |
| 推荐 | 优先 Workflow | 当 Workflow 不够灵活时 |', array['ai-tech']::text[], array['Workflow vs Agent 判断','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.10 上下文管理（Compact 机制）】
**核心问题**：链路长 → Token 积累 → 超上下文限制 → 任务崩溃

**Compact 两种触发时机**：
1. 主动触发：任务执行到一定步数后自动压缩
2. 被动触发：快到 Token 上限时强制压缩

**关键认知**：Agent 执行中人无法实时介入，压缩策略必须提前在系统层设计好。', array['ai-tech']::text[], array['上下文管理（Compact 机制）','核心问题','Compact 两种触发时机','关键认知','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.11 多 Agent 设计原则】
- 父子 Agent 不共享上下文，只通过结构化 JSON 传结果；权限可隔离可继承
- 子 Agent 上下文尽量干净：上一个 Agent 的"内心独白"不带进下一个
- 每步必有结构化日志：输入/工具/输出/耗时/Token 消耗，出问题可精确回溯
- 主 Agent 建任务 list：追踪所有子 Agent 状态', array['ai-tech']::text[], array['多 Agent 设计原则','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.12 四个 Agent 反模式（重要！）】
- 把所有任务塞进一个 Loop
- 工具全量暴露不做分组
- 不记执行日志，出问题无法定位
- 上下文污染（子 Agent 共享父 Agent 全部历史）', array['ai-tech']::text[], array['个 Agent 反模式（重要！）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.13 Agent 工程化四个问题】
| 问题 | 要点 |
|------|------|
| **任务边界** | 一个 Loop 不能揽太多，设明确出口条件和熔断阈值 |
| **工具契约** | 每个工具的元信息决定调度策略，非繁琐 API 文档 |
| **编排状态** | 路由策略和开发协商，行业无标准范式，需技术积累 |
| **评测闭环** | 统一标准，沉淀 BadCase，防止幻觉 |

## 四、MCP（Model Context Protocol）', array['ai-tech']::text[], array['Agent 工程化四个问题','任务边界','工具契约','编排状态','评测闭环','Agent','MCP','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.1 概念定义】
MCP 是一种**动态可插拔的工具连接协议**，让模型运行时按需连接第三方工具/服务，而非静态内置。

核心特点：
- 用时连接，不用不加载（避免资源浪费）
- 方便接入第三方工具（飞书 CLI、Figma、数据库等）
- 费 Token，但因灵活性仍广泛使用', array['ai-tech']::text[], array['概念定义','动态可插拔的工具连接协议','MCP','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.2 MCP 三角色（B文档核心架构）】
| 角色 | 说明 | 示例 |
|------|------|------|
| **MCP Client（Host）** | 发起调用方，即 AI 应用 / Agent | Claude Desktop、Claude Code |
| **MCP Server** | 能力提供方，暴露工具/资源 | 飞书 MCP Server、Figma MCP Server |
| **Protocol（协议层）** | 定义 Client-Server 通信格式和规范 | MCP 协议规范本身 |', array['ai-tech']::text[], array['MCP 三角色（B文档核心架构）','MCP Client（Host）','MCP Server','Protocol（协议层）','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.3 MCP Server 三大能力】
| 能力 | 说明 | 示例 |
|------|------|------|
| **Resources（资源）** | 暴露数据/文档供模型读取 | 飞书文档、数据库表、文件系统 |
| **Tools（工具）** | 暴露可调用的函数/操作 | 创建飞书文档、发送消息、查询数据库 |
| **Prompts（提示词模板）** | 提供预定义的 Prompt 模板 | 标准化的任务提示词 |', array['ai-tech']::text[], array['MCP Server 三大能力','Resources（资源）','Tools（工具）','Prompts（提示词模板）','Prompt','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.4 工作原理】
```
模型需要某个能力（如操作飞书文档）
    ↓
查找已配置的 MCP Server
    ↓
动态加载 MCP（建立连接）
    ↓
模型调用工具 → MCP Server 执行 → 返回结果
    ↓
模型基于结果继续推理
```

- MCP 在 `settings.json` 中配置，Claude Code 中默认随配置全部加载
- **最佳实践**：不写进配置文件，需要时手动告知 AI 加载对应 MCP（节省资源）
- 部分 MCP 需要登录状态（如 Figma MCP），用前要确认已登录', array['ai-tech']::text[], array['工作原理','最佳实践','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.5 与 Tools/Skills 的区别】
| 层级 | 加载时机 | 适用频率 | 示例 |
|------|----------|----------|------|
| Tools | 始终内置 | 高频 | 读文件、执行代码 |
| Skills | 触发时加载 | 中频 | 特定任务模板、飞书文档操作 |
| MCP | 按需动态加载 | 低频 | Figma、Slack、第三方 API |', array['ai-tech']::text[], array['与 Tools/Skills 的区别','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.6 A2A 协议（Agent-to-Agent Protocol）】
**概念**：A2A 是 Agent 与 Agent 之间通信的协议，解决 Multi-Agent 系统中 Agent 互操作性问题。

**核心组件**：
| 组件 | 说明 |
|------|------|
| **Agent Card** | Agent 的能力名片（我能做什么、接受什么输入、输出什么格式） |
| **Task** | 一次任务请求的完整生命周期对象 |
| **Message** | Agent 间的消息传递单元 |
| **Artifact** | Agent 的任务产出物（文件、数据、结果） |

**Task 生命周期**：
```
submitted → working → (input-required) → completed / failed / canceled
```

**A2A vs MCP 核心区别**：
| 维度 | MCP | A2A |
|------|-----|-----|
| **连接对象** | 模型 ↔ 工具/服务 | Agent ↔ Agent |
| **通信方向** | 单向（模型调用工具） | 双向（Agent 委托 Agent） |
| **适用层级** | 工具层 | 编排层 |
| **典型场景** | 调用飞书 API | 主 Agent 委托子 Agent 完成子任务 |
| **关系** | 互补，通常组合使用 | 互补 |', array['ai-tech']::text[], array['A2A 协议（Agent-to-Agen','概念','核心组件','Agent Card','Task','Message','Artifact','Task 生命周期']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.7 企业 MCP 私服】
- 企业将内部系统包装成 MCP Server，部署在内网
- AI 通过 MCP 协议访问企业内部工具（OA、ERP、知识库）
- 优势：数据不出境 + 权限管控 + 灵活扩展', array['ai-tech']::text[], array['企业 MCP 私服','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.8 混合架构（MCP + A2A）】
```
用户请求
    ↓
Router Agent（路由判断）
    ↓
Skill Agent（专能 Agent，通过 A2A 委托）
    ↓
Tool（通过 MCP 调用具体工具）
```
- A2A 负责 Agent 间任务分发
- MCP 负责 Agent 与外部服务连接', array['ai-tech']::text[], array['混合架构（MCP + A2A）','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.9 Tool Loading 优化（面试常考）】
**问题**：工具数量多时 Token 消耗大、模型注意力分散。

**优化策略**：
1. **Dynamic Tool Loading**：每个 Loop 只加载当前步骤需要的工具
2. **Tool Router**：先用一个轻量模型判断需要哪类工具，再加载对应工具集
3. **分组白名单**：为不同 Agent/任务定义工具白名单，而非全量暴露', array['ai-tech']::text[], array['Tool Loading 优化（面试常考','问题','优化策略','Tool Router','分组白名单','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.10 常见坑】
- 全部加载浪费 Token：MCP 全写进 `settings.json` 导致每次启动都连接所有服务
- 权限未配置：MCP Server 需要独立的权限/登录状态管理
- MCP 不等于工具：MCP 是连接协议，工具是具体能力，概念不要混淆

## 五、AI 技术基础（其他考点）', array['ai-tech']::text[], array['常见坑','MCP','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.1 Token】
- Token 是模型处理的最小单元（不等于字，中文约 1 汉字 = 1-2 Token，英文约 4 字符 = 1 Token）
- **成本公式**：调用次数 × Token 数 ÷ 1,000,000 × 单价（元/百万 Token）
- **上下文窗口**：模型单次能处理的最大 Token 数，超出则截断或崩溃
- 输出 Token 比输入贵（通常 4-5 倍），长输出场景要特别注意成本', array['ai-tech']::text[], array['Token','成本公式','上下文窗口']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.2 Transformer 与大模型原理】
- 基于 Transformer 架构，核心是**注意力机制（Attention）**
- 注意力机制：模型在生成每个词时，会给上下文中不同位置的词分配不同"注意力权重"
- 预测流程：输入序列 → 向量化 → 多头注意力计算 → 前馈网络 → 输出下一个 Token 的概率分布

**GPT vs BERT**：
| 模型 | 类型 | 机制 | 适用 |
|------|------|------|------|
| GPT | 生成式（Decoder only） | 从左到右预测下一个词 | 文本生成、对话 |
| BERT | 理解式（Encoder only） | 双向编码理解全文 | 分类、命名实体识别 |', array['ai-tech']::text[], array['Transformer 与大模型原理','注意力机制（Attention）','GPT vs BERT','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.3 模型推理参数（面试高频）】
| 参数 | 含义 | 实践建议 |
|------|------|----------|
| **Temperature** | 控制输出随机性（0=确定性，1=创意性，>1=混乱） | 精确任务用 0-0.3；创意任务用 0.7-1.0 |
| **Top-K** | 每步只从概率最高的 K 个词中采样 | K 越小输出越集中 |
| **Top-P（核采样）** | 从累积概率达到 P 的最小词集合中采样 | P=0.9 常用，比 Top-K 更自适应 |
| **Max Tokens** | 限制输出最大 Token 数 | 根据任务设合理上限，避免超出预算 |', array['ai-tech']::text[], array['模型推理参数（面试高频）','Temperature','Top-K','Top-P（核采样）','Max Tokens','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.4 幻觉（Hallucination）】
- **定义**：模型生成听起来合理但不准确的内容
- **根源**：模型通过预测"最可能的下一个词"生成内容，而非"检索真相"
- **检测方法**：多模型交叉验证、置信度检测、引用校验
- **防护方案**：RAG 限制生成范围、System Prompt 要求引用出处、降级策略兜底', array['ai-tech']::text[], array['幻觉（Hallucination）','定义','根源','检测方法','防护方案','RAG','Prompt','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.5 模型选型方法论】
```
任务确定后
    ↓
容错率高吗？
├─ 低（合规/财务/代码）→ 用强模型，ROI 能 cover
└─ 高（内容/摘要/分类）→ 用便宜模型，够用就行
    ↓
调用量大吗？
├─ 小量 → API 按量付费
└─ 大量 → 算月成本，考虑批量或部署
    ↓
数据能出境吗？
├─ 不能 → 国内模型（DeepSeek、Qwen）
└─ 能 → 国际模型按能力选（Claude、GPT）
```

## 六、AI 产品设计要点', array['ai-tech']::text[], array['模型选型方法论']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.1 AI 产品三大特殊性】
1. **不确定性**：输出不可完全预测，需设计降级方案
2. **数据驱动**：效果取决于数据质量，不是纯规则系统
3. **持续进化**：需要持续监控和迭代，不是一次性交付', array['ai-tech']::text[], array['AI 产品三大特殊性','不确定性','数据驱动','持续进化']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.2 降级方案四级（B文档版）】
| 级别 | 触发条件 | 处理方式 |
|------|----------|----------|
| **第一级** | AI 置信度低 | AI 自动插入不确定性标注 |
| **第二级** | 高风险领域 | 转人工/转权威来源 |
| **第三级** | AI 完全无法处理 | 固定模板回复，退出 AI 链路 |
| **第四级** | 服务不可用 | 全量人工兜底 |', array['ai-tech']::text[], array['降级方案四级（B文档版）','第一级','第二级','第三级','第四级']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.3 AI 产品 PRD 四个特殊章节】
1. **AI 能力边界说明**（能做/不能做/灰色地带）
2. **数据需求与质量标准**（来源、量、更新频率、安全要求）
3. **评估指标与基线**（采纳率、响应时间、满意度、转人工率）
4. **异常处理与降级策略**（超时、质量异常、服务不可用）', array['ai-tech']::text[], array['AI 产品 PRD 四个特殊章节','AI 能力边界说明','数据需求与质量标准','评估指标与基线','异常处理与降级策略']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.4 PM 关注的 AI 产品四层（C文档框架）】
| 层次 | 关注点 | 示例问题 |
|------|--------|----------|
| **UX 层** | 用户如何感知和使用 AI 能力 | 输出如何呈现？用户能纠错吗？ |
| **能力层** | 选哪个模型/方案、能力边界在哪 | 用 RAG 还是微调？幻觉率多少？ |
| **平台层** | AI 基础设施和成本控制 | API 成本、并发限制、数据合规 |
| **运维层** | 上线后如何监控和迭代 | BadCase 如何收集？如何快速修复？ |', array['ai-tech']::text[], array['PM 关注的 AI 产品四层（C文档框架','UX 层','能力层','平台层','运维层','RAG','微调','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.5 数据驱动迭代五个核心指标】
1. 采纳率（直接采纳 vs 修改后采纳）
2. 编辑距离（用户对输出的修改量）
3. 重试率（高→优化输出稳定性）
4. 任务完成率
5. 用户满意度', array['ai-tech']::text[], array['数据驱动迭代五个核心指标']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.6 Hook 机制（Claude Code）】
Hook 是 AI 执行特定节点的**生命周期钩子**，自动触发预定义脚本。

| 触发时机 | 典型用途 |
|----------|----------|
| PreToolUse | 危险操作前拦截检查 |
| PostToolUse | 写完代码后自动 lint/format |
| Stop | 任务完成后发通知 |
| Notification | AI 发出通知时触发 |

## 七、AI PM 核心技能（B文档求职方法论）', array['ai-tech']::text[], array['Hook 机制（Claude Code）','生命周期钩子']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【7.1 AI PM 必备能力三角】
1. **Prompt 设计能力**：能独立写出有效 Prompt，理解六要素、CoT、System Prompt 架构
2. **数据思维**：能定义 AI 产品的评估指标，会设计 A/B 测试和 BadCase 分析
3. **效果评估能力**：建立 Golden Set，设置基线，做回归测试闭环', array['ai-tech']::text[], array['AI PM 必备能力三角','Prompt 设计能力','数据思维','效果评估能力','Prompt','A/B']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【7.2 面试高频场景题回答框架】
- **"如何保证 AI 输出准确性"** → 三层：技术选型（RAG）+ 产品设计（降级/置信度）+ 运营机制（BadCase/黄金测试集）
- **"如何判断用 Agent 还是 Workflow"** → 三问：步骤能否预定义？需要自主判断吗？失败代价能承受吗？
- **"工具 Token 消耗优化"** → 动态工具加载 + Tool Router + 分组白名单

## 八、速查对比表', array['ai-tech']::text[], array['面试高频场景题回答框架','"如何保证 AI 输出准确性"','"工具 Token 消耗优化"','RAG','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Prompt / RAG / Agent / MCP 一句话定义】
| 概念 | 一句话 |
|------|--------|
| **Prompt** | 给模型的自然语言指令，成本最低的能力调整方式 |
| **RAG** | 检索外部知识 + 注入上下文，解决模型知识局限和幻觉 |
| **Agent** | LLM 自主调用工具循环执行，完成多步骤复杂任务 |
| **MCP** | 动态可插拔的工具连接协议，让模型按需接入外部服务 |
| **A2A** | Agent 间协作的通信协议，实现 Agent 互操作和任务委托 |', array['ai-tech']::text[], array['Prompt / RAG / Agent','Prompt','RAG','Agent','MCP','A2A','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【三种 AI 能力扩展方式】
| | Prompt | RAG | 微调 |
|-|--------|-----|------|
| 成本 | 低 | 中 | 高 |
| 知识注入 | 上下文窗口内 | 向量库检索 | 模型权重 |
| 数据需求 | 无 | 知识库文档 | 2000+ 标注样本 |
| 适合 | 任务调整/风格控制 | 私有知识/准确率要求高 | 特定风格/垂直领域增强 |', array['ai-tech']::text[], array['种 AI 能力扩展方式','RAG','Prompt','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【MCP vs A2A 速记】
| | MCP | A2A |
|-|-----|-----|
| 连接 | 模型↔工具 | Agent↔Agent |
| 层级 | 工具层 | 编排层 |
| 典型场景 | 调飞书API | 主Agent委托子Agent |', array['ai-tech']::text[], array['MCP vs A2A 速记','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Prompt 技巧速记】
| 技巧 | 一句话 |
|------|--------|
| 六要素 | 角色·上下文·任务·风格·格式·学习资料 |
| RTF框架 | Role-Task-Format 快速结构 |
| CoT | 让模型先思考再回答 |
| Few-shot | 给 2-5 个示例对齐期望格式 |
| System Prompt三层 | 平台级→功能级→会话级 |', array['ai-tech']::text[], array['Prompt 技巧速记','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【RAG 流程速记】
| 阶段 | 步骤 |
|------|------|
| 离线 | 文档→解析→清洗→分块→Embedding→向量库 |
| 在线 | 问题→Embedding→Top-K检索→Reranking→拼入Prompt→生成 |', array['ai-tech']::text[], array['RAG 流程速记','RAG','Prompt','Embedding']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent 速记】
| 概念 | 内容 |
|------|------|
| 五要素 | 感知·记忆·规划·行动·学习 |
| 四大组件 | 规划·记忆·工具·行动 |
| Multi-Agent四模式 | 串行·并行·辩论·层级 |
| 四大反模式 | 任务堆一Loop·工具全量暴露·不记日志·上下文污染 |
| Context Engineering | 管理Agent上下文里"装什么"的系统工程 |', array['ai-tech']::text[], array['Agent 速记','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第一部分：概念辨析（选择 / 判断）（1）】
**Q1. 以下关于 Prompt 和 RAG 的说法，哪个是错误的？**
- A. Prompt 是成本最低、最快速的 AI 能力调整方式
- B. RAG 可以解决模型知识截止点之后的信息缺失问题
- C. RAG 必须使用向量数据库才能实现
- D. Prompt 工程和 RAG 可以同时使用

**Q2. 以下关于 MCP 的描述，正确的是？**
- A. MCP 是一种模型训练协议，用于提升模型能力
- B. MCP 工具应该全部写进配置文件，方便随时调用
- C. MCP 是动态可插拔的工具连接协议，按需加载
- D. MCP 只能用于连接飞书等内部系统

**Q3. 关于 Agent Loop，以下说法正确的是？**
- A. Agent 是纯规则驱动的自动化脚本
- B. Agent = LLM + 工具 + 记忆 + 上下文系统
- C. Agent 执行过程中人可以随时介入修改
- D. Agent 每次只能调用一个工具

**Q4. 大模型"幻觉"问题的根本原因是什么？**
- A. 模型参数量不够大
- B. 训练数据不够多
- C. 模型通过预测"最可能的下一个词"来生成，而非检索真实答案
- D. 用户的 Prompt 写得不够好

**Q5. 工具分层策略中，以下对应关系正确的是？**
- A. 高频→MCP，中频→Skills，低频→Tools
- B. 高频→Tools，中频→Skills，低频→MCP
- C. 高频→Skills，中频→Tools，低频→MCP
- D. 三者没有频率区别，按功能类型分层', array['ai-tech','product']::text[], array['第一部分：概念辨析（选择 / 判断）（1','RAG','Agent','Prompt','MCP','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第一部分：概念辨析（选择 / 判断）（2）】
**Q6. 以下哪种情况最适合使用微调（Fine-tuning）而非 RAG？**
- A. 需要查询企业内部最新文档
- B. 需要让模型以特定语气和风格持续输出，且调用量极大
- C. 需要让模型知道昨天发生的新闻
- D. 需要让模型减少幻觉

**Q7. Anthropic 官方定义的 Agent 协作模式有几种？**
- A. 3 种
- B. 4 种
- C. 5 种
- D. 6 种

**Q8. 以下关于向量数据库的描述，错误的是？**
- A. 向量数据库通过余弦相似度衡量两段文本的语义相关性
- B. 语义相近的句子余弦相似度接近 1
- C. 向量化（Embedding）后，每句话被表示为一个多维浮点数数组
- D. 向量数据库只能存储文本数据，不能存储其他类型

**Q9. 关于 Claude Code 的 Hook，PreToolUse 钩子的作用是？**
- A. AI 调用工具之后自动触发脚本
- B. AI 调用工具之前自动触发脚本
- C. AI 任务完成后触发
- D. AI 发出通知时触发

**Q10. Token 的描述中，哪项是正确的？**
- A. 1 个中文字符恰好等于 1 个 Token
- B. 输入 Token 和输出 Token 的价格相同
- C. 输出 Token 通常比输入 Token 贵 4-5 倍
- D. Token 数量超出上下文窗口时模型会自动切换到更大的窗口

**Q11. 关于 Prompt 六要素，以下哪项不属于六要素？**
- A. 角色设定
- B. 任务指令
- C. 模型版本
- D. 格式规范', array['ai-tech','product']::text[], array['第一部分：概念辨析（选择 / 判断）（2','RAG','Agent','Prompt','Token','Embedding','微调','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第一部分：概念辨析（选择 / 判断）（3）】
**Q12. Temperature 参数设置为 0 时，模型输出的特点是？**
- A. 输出完全随机，每次不同
- B. 输出最确定，每次相同（贪婪解码）
- C. 输出更有创意
- D. 模型会拒绝回答

**Q13. MCP 三角色中，"MCP Server"的职责是？**
- A. 发起工具调用请求
- B. 定义 Client-Server 通信格式
- C. 暴露 Resources、Tools、Prompts 三大能力
- D. 负责模型推理计算

**Q14. A2A 协议和 MCP 协议的核心区别是？**
- A. A2A 比 MCP 更新，会取代 MCP
- B. MCP 连接模型与工具，A2A 连接 Agent 与 Agent
- C. A2A 只能用于大型企业
- D. MCP 支持双向通信，A2A 只能单向

**Q15. LoRA 微调与全量微调的本质区别是？**
- A. LoRA 只能用于小模型
- B. LoRA 冻结原有模型参数，只训练额外低秩矩阵，成本更低
- C. 全量微调效果一定比 LoRA 差
- D. LoRA 无法改变模型的输出风格', array['ai-tech','product']::text[], array['第一部分：概念辨析（选择 / 判断）（3','Agent','Prompt','MCP','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第二部分：场景应用题】
**Q16. 你在做一个建筑规范智能问答产品，用户需要查询具体条文，且要求答案可追溯。你会如何选择技术方案？**

**Q17. 产品要做一个 AI 客服，需要区分"简单问题"（如查快递）和"复杂投诉"（如赔偿纠纷）。应该用哪种 Agent 协作模式？**

**Q18. 一个 Agent 在执行长任务时经常崩溃，日志显示是 Token 超限。你作为 PM 应该怎么处理？**

**Q19. 你的 MCP 工具集越来越多，发现每次启动 Agent 都很慢，Token 消耗也增加。原因和解法是什么？**

**Q20. 产品经理在 AI PRD 中写"AI 能力边界"，应该包含哪三类内容？各举一个例子。**

**Q21. 你需要为一个法律合同 AI 助手设计 Prompt，请用 System Prompt 三层架构说明你的设计思路。**

**Q22. 当面试官问"你如何评估 RAG 系统的效果"，应该从哪几个维度回答？**

**Q23. 一个企业想把内部 ERP、OA、知识库全部接入 AI，但数据不能出境，应该如何设计架构？**

**Q24. 为什么说 Context Engineering（上下文工程）比 Prompt Engineering 更重要？**

**Q25. RAG 系统召回效果差，优化时应该按什么顺序排查？**', array['ai-tech','product']::text[], array['第二部分：场景应用题','RAG','Agent','Prompt','MCP','Token','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第三部分：原理解释题】
**Q26. 请解释 RAG 的完整流程，并说明为什么 RAG 能减少幻觉。**

**Q27. 解释 Agent Loop 的三个阶段，以及为什么压缩机制（Compact）必须在系统层面提前设计。**

**Q28. 什么是 MCP？它与普通工具调用（Tool）有什么本质区别？**

**Q29. 传统 AI 和大模型最本质的区别是什么？对 PM 意味着什么变化？**

**Q30. 解释 Agentic RAG 和标准 RAG 的区别，各适合什么场景？**

**Q31. 什么是 A2A 协议？解释 Agent Card、Task、Artifact 三个核心概念。**

**Q32. GPT 和 BERT 的本质区别是什么？作为 PM 需要理解哪些？**', array['ai-tech','product']::text[], array['第三部分：原理解释题','RAG','Agent','MCP','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第四部分：综合分析题（1）】
**Q33. 某 AI 产品上线后，发现用户重试率（用户点"重新生成"的比例）高达 40%。请分析可能的原因和优化方向。**

**Q34. 产品设计中，"灰色地带"为什么比"不能做"更需要在产品文档里重点描述？**

**Q35. 你要为一个 AI 写作助手设计 Prompt，该产品有三种用户（学生、商务人士、作家），请描述你的 Prompt 设计思路。**

**Q36. 什么是 Agent 工具契约？为什么不能直接把所有 API 文档给 Agent？**

**Q37. 请说明 AI 产品 A/B 测试与传统互联网产品 A/B 测试的三个主要区别。**

**Q38. 一句话解释"Orchestrator-Workers"模式，并说明它与 Prompt Chaining 的核心区别。**

**Q39. 什么是 AI 产品的"降级方案"？设计降级方案的核心逻辑是什么？**

**Q40. Routing（路由）模式有什么典型应用？判断"应该路由到哪个模型"的依据是什么？**

**Q41. Agent 产品设计中，为什么"任务边界"是最重要的工程问题之一？**

**Q42. 如何判断一个任务该用 Workflow（固定流水线）还是 Agent？**

**Q43. Multi-Agent 辩论（Debate）模式适合什么场景？举一个具体例子。**

**Q44. RAG 冷启动时（知识库没有数据）如何保证产品可用？**

**Q45. 解释 Prompt Injection 攻击是什么，以及如何防御。**', array['ai-tech','product']::text[], array['第四部分：综合分析题（1）','RAG','Agent','Prompt','冷启动','A/B']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【第四部分：综合分析题（2）】
**Q46. 如果面试官问"如何保证 AI 产品输出内容的准确性"，你会怎么回答？（综合题）**', array['ai-tech','product']::text[], array['第四部分：综合分析题（2）']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【快速记忆卡】
| 考点 | 记忆要点 |
|------|----------|
| Prompt 六要素 | 角色·上下文·任务·风格·格式·学习资料 |
| RTF框架 | Role-Task-Format |
| System Prompt三层 | 平台级→功能级→会话级 |
| CoT | 让模型先思考再回答 |
| Prompt安全防护 | 输入过滤·角色锁定·边界明确·输出检查 |
| RAG离线 | 文档→解析→清洗→分块→Embedding→向量库 |
| RAG在线 | 问题→Embedding→Top-K→Reranking→拼Prompt→生成 |
| RAG优化优先级 | 分块策略→Embedding模型→Reranking→Prompt拼接 |
| 进阶RAG | Agentic RAG（主动多轮）/ GraphRAG（知识图谱）/ 多模态RAG |
| 微调三种 | 全量微调 / LoRA（低秩矩阵）/ QLoRA（量化+LoRA） |
| Agent = | LLM + 工具 + 记忆 + 上下文 |
| Agent五要素 | 感知·记忆·规划·行动·学习 |
| Agent四大组件 | 规划·记忆·工具·行动 |
| Context Engineering | 管理Agent整个生命周期上下文里"装什么"的系统工程 |
| AI能力三层级 | Chatbot→Copilot→Agent |
| Multi-Agent四模式(B文档) | 串行·并行·辩论·层级 |
| 5种协作模式(官方) | 链式·路由·并行·编排Worker·评估优化 |
| 四大反模式 | 任务堆一Loop·工具全量暴露·不记日志·上下文污染 |
| Workflow vs Agent | 步骤能否预定义：能→Workflow；需AI判断→Agent |
| MCP三角色 | Client（发起方）·Server（能力提供方）·Protocol（规范） |
| MCP Server三能力 | Resources·Tools·Prompts |
| A2A核心组件 | Agent Card·Task·Message·Artifact |
| MCP vs A2A | MCP：模型↔工具；A2A：Agent↔Agent |
| Temperature | 0=确定，0.7-1=创意，>1=混乱 |
| 降级方案 | AI自兜底→转人工→规则固定→全量人工 |
| 幻觉防护 | RAG限范围·置信度检测·引用校验·多模型交叉验证 |
| AI PRD四章 | 能力边界·数据标准·评估指标·降级策略 |
| Hook时机 | Pre/PostToolUse · Stop · Notification |
| AI PM三大技能 | Prompt设计·数据思维·效果评估 |', array['ai-tech','product']::text[], array['快速记忆卡','RAG','Agent','Prompt','MCP','Embedding','微调','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1. 评价产品的四维度（产品视角，非用户视角）】
| 维度 | 内涵 | 案例 |
|------|------|------|
| 商业价值 | 广告 / 企业付费 / 知识付费 / API 付费 / 大数据分析 | 阿里中台：数据服务跨产品线通用 |
| 用户体验 | 有用性 · 易用性 · 情感响应 | 小宇宙时间戳评论=同频共鸣 |
| 技术实现 | 数据/算法驱动的差异化 | Netflix 大数据编剧《纸牌屋》 |
| 可持续 | 生态能否持续扩张 | Airbnb 生态、微信小程序 |

**三个面试案例（背诵框架）**：
- **墨迹天气（商业价值）**：本质是场景数据服务公司 → 三层变现：①场景化广告（沙尘暴推口罩）②B 端天气数据 SaaS/API（给外卖平台做分钟级降水预报，**最有想象空间**）③生活服务分发（雨天一键打车）
- **小宇宙（用户体验）**：一个洞察串三细节——时间戳评论、人工精选降低发现成本、干净社区氛围 → "听觉咖啡馆"
- **微信（可持续）**：社交关系链（数字身份证）→ 小程序把"用完即走"变"服务容器"（**最厉害的一步**）→ 克制进化观', array['product','workflow']::text[], array['评价产品的四维度（产品视角，非用户视角）','三个面试案例（背诵框架）','墨迹天气（商业价值）','最有想象空间','小宇宙（用户体验）','微信（可持续）','最厉害的一步']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2. toB vs toC（四维区别）】
| 维度 | toC | toB |
|------|-----|-----|
| 用户 vs 决策者 | 同一人 | 分离（采购/使用/IT 方） |
| 决策逻辑 | **感性**（爽、快、好看） | **理性**（ROI、数据安全、合规） |
| 核心指标 | DAU/留存/时长（抢用户时间） | 续费率/实施率（省客户时间） |
| 迭代节奏 | 小步快跑 | 克制求稳、强调兼容 |', array['product','workflow']::text[], array['toB vs toC（四维区别）','感性','理性']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3. PRD 九模块 & 竞品八步 & 数据五层级】
| PRD 九模块 | 竞品分析八步 | 数据分析五层级 |
|-----------|-------------|--------------|
| 背景 → 量化目标 → 业务调研 → 核心场景 → 业务流程 → 产品规划 → 设计 → 埋点 → 风险 | 为何做 → 定目标 → 选竞品 → 搜集 → **功能对比(真用过)** → 市场表现 → 分析方法 → 报告 | 现状 → **关系(相关)** → **因果** → 预测 → 优化 |

- 业务流程三图：流程图 / **泳道图（跨职能 B 端用）** / 时序图（研发画）
- 产品规划：架构图(1-2级菜单) → 功能清单(3-4级) → OKR 排期(MVP 优先级)
- 数据埋点用 AARRR：获取-激活-留存-变现-自传播

# B · AI 技术理论：能力阶梯六层', array['product','workflow']::text[], array['PRD 九模块 & 竞品八步 & 数据五','功能对比(真用过)','关系(相关)','因果','泳道图（跨职能 B 端用）']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1. 全局认知（M1）】
- **豆包拆解**：护城河=**推理成本领先 + 字节分发碾压冷启动**（不是模型强）；三层商业模式（C端免费圈用户/B端火山引擎API/生态协同）；增长飞轮=流量→用户→真实数据→模型迭代→体验→留存；**死穴=粘性**（用完即走）
- **传统 AI vs 大模型**：一任务一模型 → 一模型多任务；PM 三变化（固定流程→AI 工作流设计 / 需模型选型能力 / 评价标准变为回答质量·幻觉率）
- **AI PM 五能力**：技术理解 · Prompt 设计 · 数据思维 · 效果评估 · 伦理意识', array['product','workflow']::text[], array['全局认知（M1）','豆包拆解','死穴=粘性','传统 AI vs 大模型','AI PM 五能力','Prompt','幻觉','冷启动']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2. 大模型原理（M2/3）】
| 概念 | 要点 |
|------|------|
| Token | 计费单位；**输出比输入贵 4-5 倍**；成本=(输入+输出token)×单价×调用量 |
| Embedding/向量库 | 句子→语义坐标；余弦相似度管"意思一样"，关键词管"字一样"；中小规模选 pgvector |
| Transformer | 基于前文预测下一个词 + 自注意力；参数三件套=温度/Top-K/Top-P（**温度=0 是确定输出非随机**） |
| GPT vs BERT | GPT 生成式(Decoder，对话创作) / BERT 理解式(Encoder，分类NER) |
| 参数量 | 非唯一指标，看效果和成本，不迷信 |

**幻觉**：根源=预测下一词而非检索事实。
- 检测：多模型交叉验证 / 要求给来源 URL / 置信度自评 / 事实核查
- 防护（产品设计）：RAG 限范围 / 高风险人工审核 / 分级信任 / 可追溯 → **宁可拒答不乱答**
- 老师经验：分步提取 + 两模型交叉验证 + 换模型', array['product','workflow']::text[], array['大模型原理（M2/3）','输出比输入贵 4-5 倍','温度=0 是确定输出非随机','幻觉','宁可拒答不乱答','RAG','Token','Embedding']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3. Prompt 工程（M4）】
| 层次 | 内容 |
|------|------|
| 六要素 | 角色(激活知识子空间)·上下文·任务·风格·格式·学习资料 |
| RTF 框架 | Role-Task-Format（最常用） |
| 高级技巧 | Few-shot(2-3范例) / CoT(输出reason激发深度思考) / JSON结构化输出(=数据接口标准) |
| 工程化 | 版本管理 + 评估体系四层(测试集/维度体系/版本管理/自动打分) |
| System Prompt 三层 | 平台级(全局约束+注入防御) → 功能级(任务范围) → 会话级(动态) |
| 规则优先级 | 安全 > 角色 > 业务 > 用户；注入防御=输入过滤·角色锁定·边界明确·输出检查 |', array['product','workflow']::text[], array['Prompt 工程（M4）','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4. RAG 与微调（M5/6）】
| 阶段 | 流程 |
|------|------|
| RAG 离线 | 文档处理(OCR) → 分块 → 向量化 → 入库 |
| RAG 在线 | 向量检索 → Top-K(3-8初筛) → Reranking(精筛) → 拼 Prompt → 生成 |

- **优化优先级**（成本从低到高）：数据预处理 > 分块 > 混合检索+rerank > query 改写 > 多步检索
- **进阶**：Agentic RAG(想清楚再查、不够再查) / GraphRAG(知识图谱补关系) / 多模态 RAG(视觉模型提文字入库)
- **微调三种**：全量 / **LoRA(改<1%参数，最主流)** / QLoRA(加量化16→4bit)；原则=先把 Prompt+RAG 做到极致再微调；改的是格式/术语/风格，不是事实知识
- **典型反例**：规范每年更新却做微调 → 应用 RAG', array['product','workflow']::text[], array['RAG 与微调（M5/6）','优化优先级','进阶','微调三种','LoRA(改<1%参数，最主流)','典型反例','RAG','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5. Agent 架构（M7-9）】
| 要素 | 说明 |
|------|------|
| 三层级 | Chatbot → Copilot → Agent（控制权移交） |
| 五要素 | LLM 大脑 / 感知 / **分析决策(与Workflow核心区别)** / 调用工具 / 经验积累 |
| 四组件 | 规划(Plan-then-Execute+ReAct混合) / 记忆(长期写CLAUDE.md) / 工具(Function Calling) / 行动 |
| 工具三层次 | **执行层**(API/CLI) → **工具层**(MCP) → **业务层**(SKILL) |

- 上下文工程趋势：Prompt(23) → RAG(24) → Context(25) → Agent Engineering(26)
- Multi-Agent 四协作：串行(写作+审核) / 并行(多竞品调研) / 辩论(投资决策) / 层级(boss分配)
- 产品透明度对比：**Manus 高 → Claude Code 中 → Coze 低**
- 选型口诀：风险不固定+需逐条判断+要对漏看负责 → **Agent**；固定抽取 → Workflow；人主导 → Copilot；单点问答 → Chatbot', array['product','workflow']::text[], array['Agent 架构（M7-9）','执行层','工具层','业务层','Agent','RAG','Prompt','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6. Workflow + MCP/A2A（M10）】
| 协议 | 三要素/核心 |
|------|-----------|
| MCP | 三角色(Client/Server/Protocol) + Server三能力(Resources/Tools/Prompts) + 通信四步(initialize→tools/list→tools/call→result) |
| A2A | Agent Card(名片) / Task(状态机，可持久，区别MCP一次性) / Message(流式) / Artifact(交付物) |

- **互联网类比**：浏览器≈Agent Runtime，**HTTP≈MCP(连工具)**，**微服务调用≈A2A(连Agent)**，业务系统≈Agent Team
- 选型：连工具用 Function Calling/MCP，连 Agent 用 API/A2A；内部协作 API，跨系统 A2A
- 企业 MCP 私服：公共 Registry→审核→私服→分发（类比 npm 私服，敏感数据不过公网）
- Token 优化：**Router → Skill → Tool** 三层按需加载，不全量暴露

# C · AI 产品搭建：把不确定性管起来', array['product','workflow']::text[], array['Workflow + MCP/A2A（M','互联网类比','HTTP≈MCP(连工具)','Agent','Prompt','MCP','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1. 三特性 + 管理四招（9.1）】
- **三特性**：不确定性 / 数据驱动非规则 / 持续进化非一次交付
- **管理四招**：弹性三级指标 / 人机协作(低置信度转人工) / 展示置信度 / **四级降级**

| 降级级别 | 触发条件 | 做法 |
|---------|---------|------|
| ① AI 自兜底 | 置信度低 | 回答插入不确定性标注 |
| ② 转人工/权威 | **高风险领域(医疗/法律/投资)或用户要准确答案** | 给结构化引导，不直接答 |
| ③ 规则兜底 | 完全无法处理(实时数据) | 返回固定模板，不调模型 |
| ④ 全量人工 | 服务不可用 | 人工兜底 |', array['product','workflow']::text[], array['特性 + 管理四招（9.1）','三特性','管理四招','四级降级']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2. 需求到定义（9.2）】
- 需求三维度：用户需求(痛点多痛) / 商业可行性(ROI) / **技术可行性(AI 能到什么程度)**
- 四象限：业务价值×AI 适合度 → 优先落地 / 快速试验 / 战略投入 / 暂缓观察

**AI 产品 PRD 四特殊章节**：

| 章节 | 要点 | 易踩坑 |
|------|------|--------|
| 能力边界 | 能做/不能做/**灰色地带(★最重要)** | 边界模糊；灰色地带厂商不说、用户踩坑最多 |
| 数据需求与质量标准 | 来源/量/更新频率/安全 | — |
| 评估指标与基线 | 采纳率/响应时间/满意度/转人工率 | **只写目标值不写基线** |
| 异常处理与降级 | 超时/质量异常/服务不可用/用户愤怒 | 只写"转人工" |', array['product','workflow']::text[], array['需求到定义（9.2）','技术可行性(AI 能到什么程度)','AI 产品 PRD 四特殊章节','灰色地带(★最重要)','只写目标值不写基线']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3. 验证与迭代（9.3-9.4）】
- **PoC**（比 MVP 更早，主链路跑通）：测试用例(场景×难度×用户类型) → 评分 → 决策
- 用户测试四方法：绿野仙踪 WoZ(真人扮AI故意出错) / 错误注入 / 信任度量表 / A/B 对比
- **五核心指标**：采纳率 / 编辑距离 / **重试率(高→修稳定性非平均质量)** / 任务完成率 / 满意度
- BadCase 闭环：入库 → 分类(知识/格式/理解/遗漏/风格) → **5WHY 根因** → 回归+灰度；P0-P3=频率×严重度
- AI 产品 A/B 三不同：周期更长(4周+) / 指标更复杂 / 变量更多
- 三停止信号：边际效益递减 / 指标冲突 / 超过人类基线', array['product','workflow']::text[], array['验证与迭代（9.3-9.4）','PoC','五核心指标','重试率(高→修稳定性非平均质量)','5WHY 根因','灰度','A/B']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4. 项目全流程 & PM 四技能（M11-13）】
- **8 问清单**（该不该上 AI）：输入输出明确？有数据？错了多严重？容忍错误率？人工多久？有现成方案？预算？速度要求？
- PM 与算法沟通五件套：业务背景 / IO Schema / 评估指标 / 异常边界 / 测试样例≥20
- 数据质量三板斧：交叉验证(一致率<80%=规范有问题) / 专家抽检10-20% / 迭代更新
- PM 设计四层：UX层(3步创建/流式Preview) → 能力层(Prompt面板/Flow Builder) → 平台层(RBAC/多租户) → 运维层(日志/QoS告警)
- **黄金测试集**：50-100 条起步，核心场景每类≥10 条，改 Prompt/换模型必跑回归，**通过率≥95% 才上线**
- PM 四技能：需求分析(RICE/KANO/用户故事) / 数据分析(埋点三要素) / 项目管理(Scrum/**估时×1.5**，AI项目+30-50%buffer/KPT复盘) / 文档写作

# D · AI Coding：Agent 效果 = 模型能力 × Harness 质量', array['product','workflow']::text[], array['项目全流程 & PM 四技能（M11-1','8 问清单','黄金测试集','通过率≥95% 才上线','估时×1.5','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1. 演进五阶段 & 全栈地基】
| 阶段 | 代表 |
|------|------|
| L1 对话问答 → L2 辅助开发 → **L3 Agent 辅助(Claude Code)** → L4 虚拟员工(Manus/OpenClaw) → L5 团队级 | 研发从写代码变技术决策；产品思维更突出 |

**全栈地基**：

| 层 | 要点 |
|----|------|
| 前端 | HTML骨架/CSS样式/JS大脑；React=组件化+数据驱动（AI 生成 React 最准：训练数据多、模式统一） |
| 后端三组件 | 数据库(CRUD) / **API服务器(中枢，前端永不直连数据库)** / 任务队列(异步外包) |
| AI 友好栈 | Supabase(库+Auth+自动API+RLS) + Next.js(前端+轻后端+文件路由) + Vercel(一键部署) |
| API vs SDK | API 是规则(接口约定)，SDK 是帮你遵守规则的现成代码 |

- Git 三工作流：add+commit(快照) / branch+merge(每功能一分支一Agent，可回滚) / push+pull
- 测试三层：单元 → 集成 → **E2E(模拟真实用户，资源有限优先保)**
- 安全两坑：密钥→环境变量(禁进前端) / 越权→**RLS 数据库层锁死**，对用户端零信任', array['product','workflow']::text[], array['演进五阶段 & 全栈地基','全栈地基','RLS 数据库层锁死','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2. Harness 工程（第 4 课核心）】
| Harness 五问题 | 状态持久性 / 目标一致性 / 行动可验证性 / 熵增抑制 / 人机边界 |
|---------------|-----|

- **知识外化**：CLAUDE.md/agent.md——隐性知识对 AI 等于不存在，这是 Harness 第一步
- **Context Engineering**：上下文是最珍贵资源；/context 查看、/compact 压缩、/new 重开(前提：commit+progress.md+CLAUDE.md 更新好)
- **多会话记忆**：把记忆从 context 搬到文件系统；**双模式工作法**=Initializer(搭骨架+FeatureList全标未完成) + Coding(逐条做完标[x]commit)——把"完成"变成外部可验证标准
- **工具封装**：Tools(内置) / Skills(可复用流程资产) / MCP(重型U盘)；原则=不让模型直接调工具，让模型写代码调，只回传最终结果
- **编排五模式**：链式 / 路由 / 并行 / 编排者-执行者 / **评估者-优化者(高质量输出)**', array['product','workflow']::text[], array['Harness 工程（第 4 课核心）','知识外化','多会话记忆','双模式工作法','工具封装','编排五模式','评估者-优化者(高质量输出)','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3. Vibe → Spec Coding（第 5 课）】
| | Vibe Coding | Spec Coding(SDD) |
|--|------------|-----------------|
| 适合 | 快速验证/演示 | 可持续有质量开发 |
| Spec 五件事 | — | 功能描述/具体行为/数据模型/边界情况/验收标准 |

- 人机闭环七步：人拆最小需求 → propose 细化 Spec → apply 按 Spec 开发 → AI 自验 → 人验收(**不符合先改Spec不改代码**) → archive+commit → 自动部署
- 工具：speckit(五步细拆，正式项目) vs OpenSpec/opsx(propose 重+explore+sync，增量变更)
- **两类 Agent 分界**：有无操作系统(文件系统+命令执行) → Claude Code 类持续可自迭代；项目内 Agent 瞬时、接不了 Skill

# E · Agent 专项：控制权放在哪一层', array['product','workflow']::text[], array['Vibe → Spec Coding（第','不符合先改Spec不改代码','两类 Agent 分界','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1. 概念层】
- 控制权四档：Chatbot(用户全程/顾问) → Copilot(操作+建议/副驾) → Agent(部分移交/项目经理) → Workflow(设计者定义/流水线)
- Agent = LLM(推理) + 工具(行动) + 记忆(持久化) + 上下文系统(环境输入)
- Loop 三阶段：Init(收集上下文) → Loop(buildMessages→streamAPI→runTools→回填) → Shutdown(清理保存)
- PM 要看：循环有无终止条件 / 权限有无结构化 / 失败结果有无进入下一轮；好设计=内循环高效自转+外循环少打断', array['product','workflow']::text[], array['概念层','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2. 五大产品范式（控制权放五个位置）】
| 产品 | 范式 | 控制权核心 | 记忆机制 |
|------|------|-----------|---------|
| Claude Code | 终端 Agent | 本地授权+事件流 | **CLAUDE.md+memory(有持久)** |
| Codex | 协议 Runtime | turn/session 协议审计 | **session 用完即弃** |
| DeepAgents | 框架 Harness | middleware 组合顺序 | state store |
| OpenClaw | 网关平台 | 多层 policy | workspace state |
| Hermes | 学习 Agent | curator 经验筛选(**不直接喂下一次**) | Dream 整合 |', array['product','workflow']::text[], array['大产品范式（控制权放五个位置）','session 用完即弃','不直接喂下一次','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3. 四大核心模块】
| 模块 | 要点 |
|------|------|
| 工具系统 | 三层分离：发现层→可见层(canUseTool动态过滤)→执行层(沙箱)；Codex registry 30个≠本轮specs 5个；分级 Tool/Skill/MCP |
| 记忆上下文 | **Compact 三档**(75%auto→90%reactive→95%collapse，提前降级非满了才压) / **Tombstone**(压缩留标记，非崩溃回滚) / Dream 三控制门(relevance/frequency/recency) |
| 权限安全 | 权限=结构化事件非UI弹窗；四档 Plan(代码层禁写)/Default(逐次确认)/**Auto(分类器审批需opt-in)**/Trusted；BashTool六层 fail-safe(判断不了默认拒绝，记录 name+id+input+reason) |
| 多Agent编排 | **隔离质量>并发数量**；子Agent不共享父全部上下文(DeepAgents排除messages/todos/skills/memory)；continue vs spawn(独立/隔离/并行→spawn)；生命周期 start→check→update→cancel→list |

**子 Agent 三模式**：Task(委派不共享历史) / **Fork(复用query()、共享cache、继承父历史)** / **CCR(远程执行+permission bridge回传)**', array['product','workflow']::text[], array['大核心模块','Compact 三档','Tombstone','隔离质量>并发数量','子 Agent 三模式','/','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4. Harness 护城河 & 落地决策】
- 三支柱：QueryEngine(状态容器+主循环) / Permission Bridge(权限语义延伸) / Message Adapter(消息统一)
- **模型可买，Harness 自建**：取决于工程积累+设计取舍+迭代深度，买不来
- 8 硬标准（**前3条是地基**）：①主循环 ②状态容器 ③工具存在/可见分离 ④权限结构化 ⑤上下文真源层级 ⑥compact/resume ⑦失败可复盘 ⑧扩展有边界
- 决策三问：步骤能预定(能→Workflow) / 要AI自主判断(不要→Copilot) / 失败代价能承受(不能→加限制降级)
- 决策树 6 步：**产品形态★最重要** → 安全模型 → 上下文策略 → 工具生态 → 扩展性 → 学习能力（形态选错，做再好也是错）
- 场景判断：审图→Workflow内嵌Agent+人工复核 / 代码补全→Copilot / 知识问答→RAG+Chatbot

# 跨文档知识线索展开分析

五篇笔记不是并列的五个主题，而是被三条"暗线"串起来的整体。理解这三条线，就能把 200+ 个散点收敛成一张网。', array['product','workflow']::text[], array['Harness 护城河 & 落地决策','模型可买，Harness 自建','前3条是地基','产品形态★最重要','RAG','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【线索一：控制权——贯穿全书的第一性问题】
"控制权放在哪"从产品认知一路下沉到系统架构，每篇都在回答它的一个侧面：

| 文档 | 控制权的形态 | 具体体现 |
|------|-------------|---------|
| A | 用户 vs 决策者的分离 | toB 使用者≠采购决策者，产品要在"老板要的管控"和"员工要的顺手"间平衡 |
| B | AI 能力三层级的移交 | Chatbot(用户全程)→Copilot(建议)→Agent(部分移交)，控制权逐级让渡 |
| C | 降级=控制权转移 | 四级降级本质是"AI→权威→规则→人"的控制权逐级交还，每级让用户知道"谁在负责" |
| D | 人机边界 | Harness 五问题之一"何时自主、何时交给人"；Spec Coding 用"先锁需求"把控制权留在人手里 |
| E | 全文主线 | 五大产品 = 把控制权放在五个不同层（本地授权/协议/顺序/policy/筛选） |

**串联价值**：面试被问"你怎么设计一个 AI 产品"，可以用控制权作为统一回答框架——先判断这个场景控制权该放哪一层（用户/AI/流程），就能推出该用 Chatbot/Copilot/Agent/Workflow 中的哪个形态，再推出权限、降级、隔离怎么设计。', array['product','workflow']::text[], array['线索一：控制权——贯穿全书的第一性问题','串联价值','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【线索二：不确定性——从"承认它"到"驯服它"】
大模型"预测下一词而非检索事实"是一切的起点，五篇给出的是层层递进的应对：

```
B 认识不确定性 ──→ C 管理不确定性 ──→ D 约束不确定性 ──→ E 兜底不确定性
   幻觉根源         四级降级/BadCase      Spec先锁需求防脑补     fail-safe默认拒绝
   RAG限范围         灰色地带/置信度        双模式FeatureList      6种失败场景评测闭环
```

| 文档 | 对不确定性的处理 |
|------|----------------|
| B | **认识**：幻觉根源是生成机制；用 RAG 限范围、多模型交叉验证降低 |
| C | **管理**：弹性指标+置信度+四级降级；灰色地带比"不能做"更要写清 |
| D | **约束**：Spec Coding 先把"要做什么"写死，防止 AI 每次脑补不同方案 |
| E | **兜底**：fail-safe 原则(判断不了默认拒绝)；评测闭环覆盖 6 种失败场景 |

**串联价值**：这条线揭示了 AI 产品经理和传统 PM 的本质分野——传统 PM 设计"确定功能"，AI PM 设计"如何与不确定性共处"。C 文档整篇、E 文档权限/评测部分，本质都是这条线的展开。', array['product','workflow']::text[], array['线索二：不确定性——从"承认它"到"驯服','认识','管理','约束','兜底','串联价值','RAG','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【线索三：上下文/知识工程——Agent 时代的核心壁垒】
从"怎么写一句好 prompt"演进到"整个任务生命周期里上下文装什么"，是能力升级的主轴：

| 文档 | 上下文工程的阶段 |
|------|----------------|
| B | 提出趋势：Prompt(怎么问) → RAG(补外部知识) → **Context Engineering(给什么信息)** → Agent Engineering |
| C | 数据侧：数据质量三板斧、知识库更新 Pipeline |
| D | 工程侧：CLAUDE.md 知识外化、/compact、progress.md 多会话续航、双模式工作法 |
| E | 系统侧：Compact 三档自动降级、Tombstone 墓碑、Dream 三控制门、真源层级 |

**串联价值**：B 只是抛出"Context Engineering 比 Prompt Engineering 更重要"的判断，真正的答案在 D 和 E——D 讲人怎么手动管理上下文(写 CLAUDE.md、切 /new)，E 讲系统怎么自动管理(三档压缩、墓碑标记)。三篇合起来才是完整的"上下文工程"知识体系。', array['product','workflow']::text[], array['线索三：上下文/知识工程——Agent ','串联价值','RAG','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【三条概念升级链（同一概念在不同文档的深度递进）】
| 概念 | B（概念） | D（工程实践） | E（架构深水区） |
|------|----------|--------------|----------------|
| Harness | — | 定义+五问题(入门框架) | 五产品源码验证，8 条硬标准 |
| Multi-Agent | 四协作模式(串并辩层) | 编排五模式操作 | 隔离与生命周期("能隔离住状态才叫架构能力") |
| 工具管理 | Function Calling / MCP 三角色 | Tools/Skills/MCP 三层封装 | 发现/可见/执行三层分离 + 分级 |
| RAG/微调/Prompt 选型 | 原理与方式 | — | 选型两问(更新频率+定制程度)+典型反例 |

**读法建议**：遇到一个概念别停在最先看到的那一篇。比如"Harness"在 D 只是个入门框架，真正的深度在 E；"上下文压缩"在 D 是手动 /compact，在 E 是自动三档降级。**顺着升级链往深处读，才能从"知道名词"到"会做设计"。**', array['product','workflow']::text[], array['条概念升级链（同一概念在不同文档的深度递','读法建议','RAG','Agent','Prompt','MCP','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.1 产品界面长什么样】
**终端 CLI 模式**（最基础的用法）：

```
$ claude "帮我给登录页加一个验证码输入框"

◆ Claude Code v1.x
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  正在读取 src/pages/Login.tsx...
  正在分析组件结构...

  计划：
  1. 在 LoginForm 组件中添加 captcha state
  2. 渲染 <CaptchaInput /> 子组件
  3. 更新表单提交逻辑验证验证码

  执行上述修改？ [Y/n] Y

  ✓ 已修改 src/pages/Login.tsx
  ✓ 已修改 src/components/CaptchaInput.tsx（新建）
  ✓ 正在运行测试...
  ✓ 所有测试通过
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**桌面 App 模式**（2026年4月新版）：类似 ChatGPT 的聊天界面，左边是会话列表，右边是对话区，底部可以拖入截图。具体样式参见官方页面：https://www.anthropic.com/product/claude-code

**IDE 集成**：在 VS Code 里作为侧边栏面板出现，右键菜单里有"Ask Claude"选项。', array['product']::text[], array['产品界面长什么样','终端 CLI 模式','桌面 App 模式','IDE 集成']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.2 架构图】
```
┌─────────────────────────────────────────────────────┐
│                    用户界面层                         │
│   CLI终端    桌面App    VS Code插件    Web界面          │
└──────────────────────┬──────────────────────────────┘
                       │ 自然语言指令
┌──────────────────────▼──────────────────────────────┐
│                   Context 组装层                      │
│  系统提示词 + 工具定义 + 项目文件 + 对话历史            │
│              (预算上限：1,000,000 tokens)             │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  Agent 循环（核心引擎）                │
│                                                      │
│   用户输入  →  模型推理  →  选择工具  →  等结果         │
│      ↑                                    │          │
│      └──────────── 结果反馈 ←─────────────┘          │
│                                                      │
│   直到模型说"完成"为止，循环结束                        │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   内置工具池  │ │  权限审批层   │ │  MCP 服务器  │
│ git / bash   │ │ 7级权限模式  │ │ GitHub/Slack │
│ 文件读写     │ │ 沙箱边界     │ │ 自定义工具   │
│ 测试运行     │ │ 危险操作拦截  │ │             │
└──────────────┘ └──────────────┘ └──────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│               OS 级沙箱执行层                         │
│   macOS Seatbelt / Linux bubblewrap                  │
│   (内核级隔离，即使模型被骗也无法逃脱)                  │
└─────────────────────────────────────────────────────┘
```', array['product']::text[], array['架构图','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.3 核心设计决策逐条拆解（1）】
#### 决策一：推理层 vs 执行层 彻底分离

**是什么：** Claude（模型）只负责"想做什么"，Claude Code（框架）负责"能不能做、怎么做"。  
**为什么：** 模型可能被恶意内容欺骗（Prompt Injection），但框架里的沙箱是内核级别的，模型的判断影响不了它。  
**类比：** 医生决定开什么药（推理），药剂师验方才发药（执行）。

#### 决策二：Context Window 是唯一的真正瓶颈

**是什么：** 不限制 API 调用次数，只把 1M token 的上下文窗口当作预算来精细管理。  
**为什么：** 开发者希望 AI 深入理解代码库，这需要尽量多的上下文，所以要把最重要的内容"装进去"。

#### 决策三：7级权限，拒绝最优先

**权限从低到高：**

| 模式 | Claude 能做什么 | 用户介入程度 |
|------|----------------|-------------|
| plan | 只能写计划，不执行 | 每步都要确认 |
| default | 自动改文件，跑命令前问 | 中等 |
| acceptEdits | 大多数修改自动批准 | 低 |
| auto | ML 分类器动态判断 | 最低有效 |
| dontAsk | 在沙箱内完全自主 | 几乎不问 |
| bypassPermissions | 关掉沙箱（紧急用） | 危险，需明确授权 |

**设计精髓：广范围的拒绝规则 > 窄范围的允许规则。** 这防止了权限升级漏洞。', array['product']::text[], array['核心设计决策逐条拆解（1）','是什么','为什么','类比','权限从低到高','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.3 核心设计决策逐条拆解（2）】
**数据佐证：** 旧版每次都问用户，用户批准率 93%（等于没拒绝过）——人们看太多弹窗会停止阅读。新版用沙箱替代弹窗，权限提示减少 84%，安全性反而更高。

#### 决策四：Subagent（子 Agent）并行执行

**是什么：** Claude Code 可以同时开多个独立的 Agent 实例，各自有独立的 context。  
**使用场景：** 同时重构10个模块、并行跑多个测试、独立研究不同技术方案。  
**代价：** 每个子 Agent 都消耗独立的 token 预算。', array['product']::text[], array['核心设计决策逐条拆解（2）','数据佐证','是什么','使用场景','代价','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.4 安全事件与教训】
**2026年2月红队发现：** 研究人员诱导员工执行了含恶意提示的 Claude Code，让 AI 读取 AWS 密钥并外传。25次测试中成功24次。

**Anthropic 的应对：**
- 执行前代码审计（运行代码前必须明确授权）
- 实时 Prompt Injection 检测
- 密钥与沙箱物理隔离（通过代理服务，密钥不进沙箱）

**PM 启示：** Agent 安全不是"解决"问题，是"持续攻防"。分层防御比单点防御更重要。', array['product']::text[], array['安全事件与教训','2026年2月红队发现','Anthropic 的应对','PM 启示','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.5 关键数据】
| 指标 | 数值 | 意义 |
|------|------|------|
| Context 预算 | 1,000,000 tokens | 约75万字，能装下中型代码库 |
| 内置工具数 | 54+ | git / bash / 文件 / 测试等全覆盖 |
| 权限弹窗减少 | 84% | 沙箱替代了大量确认弹窗 |
| 支持界面数 | 4+ | CLI / 桌面 App / IDE / Web |
| 底层模型 | Claude Sonnet/Opus | 流式输出，工具调用中间可以插入 |', array['product']::text[], array['关键数据']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【1.6 AI PM 三条启示】
1. **产品设计优先级 = 瓶颈在哪里就优化哪里。** Claude Code 把资源全押在 context 管理上，因为它清楚那才是真正的约束，不是 API 次数或速度。  
2. **安全 = 权限系统 × 沙箱 × 内核级隔离。** 三层独立，任何一层失效都有其他层兜底。产品设计时要追问："这层失效了，下一层怎么接？"  
3. **用户不读弹窗，要用结构替代授权。** 把"什么能做"写进架构约束里，比靠用户一直点"同意"更安全。

<a name="第二章"></a>
## 第二章：Codex CLI — 协议 Runtime 范式', array['product']::text[], array['AI PM 三条启示','用户不读弹窗，要用结构替代授权']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.1 产品界面长什么样】
终端中运行，有彩色语法高亮的代码 diff（对比）显示，内联审批按钮，以及 Agent 解释说明的 Markdown 渲染。

官方演示截图：https://github.com/openai/codex/blob/main/.github/codex-cli-splash.png', array['product']::text[], array['产品界面长什么样','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.2 架构图】
```
┌─────────────────────────────────────────────────────┐
│                 多端用户界面层                         │
│  终端TUI   VS Code扩展   Cursor IDE   桌面App   网页  │
└──────────────────────┬──────────────────────────────┘
                       │ 统一 JSON-RPC 2.0 消息
┌──────────────────────▼──────────────────────────────┐
│             App Server（协议运行时）← 核心创新         │
│                                                      │
│  • thread/start     创建对话线程                      │
│  • turn/start       开始一轮 Agent 执行               │
│  • command/exec     执行 shell 命令                   │
│  • turn/interrupt   中断 Agent                       │
│                                                      │
│  仅负责：消息路由 + 状态管理（不存储代码）              │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              核心 Agent 运行时（codex-rs，用 Rust 写）  │
│                                                      │
│  ① 用户输入  →  ② LLM 推理  →  ③ 选择工具            │
│       ↑                              │               │
│       └──────── ④ 工具结果反馈 ←────┘               │
│                                                      │
│  工具执行在独立子进程（解耦，单个工具崩了不影响 Agent） │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Shell 执行  │ │  文件操作    │ │  MCP 服务器  │
│  子进程隔离  │ │  逐文件审批  │ │  独立进程    │
│  沙箱边界   │ │             │ │  Figma/GitHub│
└──────────────┘ └──────────────┘ └──────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│               OS 级沙箱（同 Claude Code）              │
│   macOS: Seatbelt │ Linux: bubblewrap + seccomp       │
│   .git 目录永远只读，防止意外损毁仓库历史               │
└──────────────────────────────────────────────────────┘
```', array['product']::text[], array['架构图','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.3 核心创新：协议 Runtime 是什么意思】
**问题背景：** 在没有"协议层"之前，如果你想让 VS Code 插件和终端 CLI 用同一个 Agent，要么写两套代码，要么行为不一致。

**Codex 的解法：** 定义一套 JSON-RPC 2.0 标准消息格式，所有界面都说这个语言，App Server 只负责翻译和路由，不做业务逻辑。

**实际协议消息长这样：**
```json
// 界面发送：开始一轮对话
{"method": "turn/start", "id": 2, "params": {
  "threadId": "thr_123abc",
  "userMessage": "帮我修复 auth.ts 里的 bug"
}}

// Server 流式返回：
{"method": "item/agentMessage/delta", "params": {"delta": "我来看看 auth.ts..."}}
{"method": "turn/completed", "params": {"status": "success"}}
```

**好处：**
- 所有界面行为一致（终端里做的和 VS Code 里做的完全一样）
- 加新界面不改 Agent 逻辑
- 不存储代码到 OpenAI 服务器（符合企业零数据保留合规要求）', array['product']::text[], array['核心创新：协议 Runtime 是什么意','问题背景','Codex 的解法','实际协议消息长这样','好处','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.4 "解耦"架构的关键设计】
**工具执行在独立子进程：**

| 传统方式 | Codex 方式 |
|---------|-----------|
| 工具在 Agent 进程里运行 | 工具在独立子进程里运行 |
| 一个工具崩溃 → Agent 崩溃 | 一个工具崩溃 → 只杀该子进程，Agent 继续 |
| 难以设定资源限制 | 每个子进程有独立 CPU/内存限制 |

**类比：** 餐厅厨房里不同厨师负责不同菜品，其中一个出错，其他桌的菜不受影响。', array['product']::text[], array['"解耦"架构的关键设计','工具执行在独立子进程','类比','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.5 与 Claude Code 的本质区别】
| 维度 | Claude Code | Codex CLI |
|------|-------------|-----------|
| 执行方式 | 本地、同步、互动 | 可异步、可批量排队 |
| 典型场景 | 实时协作改一个功能 | 排5个任务去跑，回来看结果 |
| 上下文记忆 | 长对话中持续积累 | 默认每次会话是新的 |
| 工具执行 | Agent 进程内 | 独立子进程（更稳健）|
| 架构特色 | 权限 + 沙箱分层 | 协议统一 + 执行解耦 |
| 最适合 | 复杂功能 + 来回确认 | 批量任务 + 离线跑 |', array['product']::text[], array['与 Claude Code 的本质区别','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.6 AI PM 三条启示】
1. **协议标准化 = 界面无限扩展的基础。** 一旦定义好消息格式，加新界面（手机、Slack Bot、语音）都不需要改核心逻辑。做平台型产品时，先把协议想清楚。  
2. **解耦提升稳健性，也提升可测性。** 独立子进程意味着可以单独 mock（模拟）工具，不需要真正跑 AI 就能测到工具层的边界情况。  
3. **合规可以是架构特性，不是事后补丁。** Stateless App Server（不存代码）是架构决策，天然满足企业 Zero Data Retention 要求，不需要额外做合规功能。

<a name="第三章"></a>
## 第三章：DeepAgents — 框架 Harness 范式', array['product']::text[], array['AI PM 三条启示','解耦提升稳健性，也提升可测性','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.1 产品界面长什么样】
DeepAgents 是一个开发框架，面向工程师，主要是代码界面。但它附带了一个可视化 UI 项目（https://github.com/langchain-ai/deep-agents-ui），让非工程师也能观察 Agent 在干什么。

框架用法示例（Python 代码，感受一下"简化"的程度）：
```python
from deepagents import create_agent

# 三行代码就有一个完整 Agent，包含：
# 文件系统访问 + 子 Agent 调度 + 人工审批 + 持久记忆
agent = create_agent(
    model="claude-sonnet-4-6",
    tools=["filesystem", "web_search", "spawn_subagent"]
)
agent.run("分析这个项目的所有 Python 文件，找出循环依赖")
```', array['product']::text[], array['产品界面长什么样','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.2 架构图】
```
┌─────────────────────────────────────────────────────┐
│                用户（开发者调用层）                    │
│           create_agent(model, tools)                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DeepAgents（框架层，本章主角）            │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │
│  │  执行环境  │  │  上下文管理 │  │   子 Agent 调度 │ │
│  │ 虚拟文件系统│  │ 技能库     │  │  spawn_subagent │ │
│  │ 沙箱代码运行│  │ 持久记忆   │  │  任务 Todo 追踪 │ │
│  │ Shell 解释器│  │ 自动摘要   │  │  隔离 context  │ │
│  └────────────┘  └────────────┘  └────────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │          人工介入层（Steering）                │   │
│  │  LangGraph interrupt → 危险操作暂停 → 用户确认 │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  中间层：LangChain                    │
│                   create_agent                       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              底层运行时：LangGraph                    │
│       流式输出 / 检查点 / 持久化 / 图执行引擎           │
└─────────────────────────────────────────────────────┘
```', array['product']::text[], array['架构图','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.3 "框架 Harness"解决什么问题】
**没有框架之前，开发者要自己搞定：**
- Agent 的循环逻辑（什么时候停？出错重试几次？）
- 上下文超限怎么压缩？
- 怎么让多个 Agent 协作但不互相污染上下文？
- 危险操作怎么暂停等人审批？
- 任务状态怎么持久化（防止中途崩溃全白费）？

**DeepAgents 把以上全封装好了**，开发者只需要写业务逻辑。

类比：盖房子不需要自己炼钢，买好型号的钢材来用就行。', array['product']::text[], array['"框架 Harness"解决什么问题','没有框架之前，开发者要自己搞定','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.4 关键设计：上下文卸载（Context Offloading）】
**问题：** 长任务会撑爆 AI 的 context window（比如分析1000个文件）。

**解法：** 把"暂时用不上"的内容写到文件系统里，只把当前需要的内容放进 context。

```
完整文件列表（1000个文件）
       │
       ▼
  [DeepAgents]
       │ 智能筛选
       ▼
  当前 context（只放正在分析的20个文件）
       │
       ▼
  [AI 推理]
```

**类比：** 律师事务所的大案件，每天只把今天需要的卷宗放桌上，其他的锁进档案室。', array['product']::text[], array['关键设计：上下文卸载（Context O','问题','解法','类比','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.5 子 Agent 调度：任务 Todo 追踪】
DeepAgents 提供了 `write_todos` 工具，让主 Agent 可以拆分任务并追踪进度：

```
主 Agent：
  [x] 分析 auth 模块（子 Agent 1 已完成）
  [x] 分析 database 模块（子 Agent 2 已完成）
  [ ] 分析 frontend 模块（子 Agent 3 进行中）
  [ ] 生成综合报告（等待中）
```

每个子 Agent 在独立的 context 里跑，相互不干扰，主 Agent 只看汇总结果。', array['product']::text[], array['子 Agent 调度：任务 Todo 追','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.6 AI PM 三条启示】
1. **框架产品的核心价值 = 让开发者不用重复造轮子。** DeepAgents 把"Agent 基础设施"标准化，每个用它的团队都省了2-4周的基础建设时间。  
2. **人工介入点（Human-in-the-loop）要精准设计，不能太多也不能太少。** DeepAgents 只在"危险操作"触发 interrupt，不是每步都打断——这和 Claude Code 的"审批疲劳"发现是同一个教训。  
3. **上下文卸载是扩展 AI 能力边界的关键技术。** 超长任务的瓶颈永远是 context window，框架层的卸载策略决定了能处理任务的规模上限。

<a name="第四章"></a>
## 第四章：OpenClaw — 网关平台范式', array['product']::text[], array['AI PM 三条启示','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.1 产品界面长什么样】
网关平台主要是配置界面（Web Dashboard）和 API 入口，不是对话式 UI。

典型界面包括：
- **供应商配置页：** 填入各家 API Key（Anthropic / OpenAI / DeepSeek / Gemini），配置优先级和降级策略
- **流量监控页：** 实时看每个模型的调用量、延迟、错误率、费用
- **路由规则页：** 设定"超过 X token 用 A 模型，低于 Y 元用 B 模型"等路由逻辑', array['product']::text[], array['产品界面长什么样','供应商配置页','流量监控页','路由规则页']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.2 架构图】
```
┌─────────────────────────────────────────────────────┐
│                    客户端（你的代码）                   │
│  Claude Code / 自研 Agent / 任何 OpenAI 兼容的调用     │
└──────────────────────┬──────────────────────────────┘
                       │ 统一 API（OpenAI 格式）
                       │ POST /v1/chat/completions
┌──────────────────────▼──────────────────────────────┐
│               OpenClaw 网关（本章主角）                │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  认证鉴权 │  │  路由引擎 │  │  可观测性（Telemetry）│ │
│  │ API Key  │  │ 规则匹配  │  │  Token 计量        │ │
│  │ 限速控制  │  │ 负载均衡  │  │  延迟/错误监控     │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │              供应商降级策略                      │ │
│  │  主选：Claude Sonnet → 失败/超时 → GPT-4o       │ │
│  │  成本控制：白天用 Sonnet，夜间用 DeepSeek        │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   Anthropic  │ │  OpenAI  │ │ DeepSeek │ │  Gemini  │
│   Claude API │ │  GPT API │ │   API    │ │   API    │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘
```', array['product']::text[], array['架构图','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.3 "网关平台"解决什么问题】
**没有网关之前：**
- 从 GPT 换成 Claude，要改所有调用代码
- API 出故障，服务直接挂掉，没有自动降级
- 不知道每个模型花了多少钱，哪个 Agent 最贵
- 多个项目各自管各自的 Key，Key 泄露排查困难

**有了网关之后：**
- 所有调用统一走网关，换模型只改网关配置
- 主模型故障自动切备用，用户无感
- 统一计量 token 消耗，成本一目了然
- API Key 统一管理，最小权限下发

**类比：** 电力公司的变电站——你家电器不用管是核电还是风电，插上就能用，变电站负责调度来源。', array['product']::text[], array['"网关平台"解决什么问题','没有网关之前','有了网关之后','类比','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.4 关键设计：路由规则】
路由规则决定什么时候用哪个模型：

```yaml
routes:
  - name: "大文档处理"
    condition: "input_tokens > 50000"
    model: "claude-sonnet-4-6"      # 长上下文首选 Claude
    
  - name: "代码生成"
    condition: "task_type == ''code''"
    model: "gpt-4o"                   # 代码任务 GPT 表现稳定
    
  - name: "夜间批量任务"
    condition: "hour >= 23 or hour < 6"
    model: "deepseek-v3"              # 夜间用成本更低的模型
    
  - name: "默认"
    model: "claude-haiku-4-5"         # 兜底：最快最便宜
```', array['product']::text[], array['关键设计：路由规则']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【4.5 AI PM 三条启示】
1. **基础设施抽象层是产品成熟度的标志。** 早期项目直接调 API，有一定规模后必然需要网关来做统一治理。这是从"能用"到"可运营"的关键一步。  
2. **供应商多元化是 AI 产品的风险对冲策略。** 单一供应商依赖是商业风险（价格、政策、可用性）。网关让你保持多供应商而不增加开发复杂度。  
3. **可观测性（Telemetry）要从第一天就做，而不是出问题了再补。** 不知道 Token 消耗分布就无法优化成本；不知道延迟分布就无法做 SLA 承诺。

<a name="第五章"></a>
## 第五章：Hermes — 学习 Agent 范式', array['product']::text[], array['AI PM 三条启示','Agent','Token']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.1 产品界面长什么样】
Hermes 同时支持终端 CLI 和 Web UI，还有桌面客户端。核心交互是对话式，但有一个显著特征——会话旁边有"技能库"面板，展示 Agent 积累了哪些可复用技能。

示例交互流程：
```
用户：帮我分析2024年Q4的销售数据，生成可视化报告

Hermes：
  正在执行任务...
  ─────────────────────────────────────────
  ✓ 读取销售数据（CSV）
  ✓ 清洗异常值
  ✓ 生成 matplotlib 图表
  ✓ 导出 PDF 报告
  ─────────────────────────────────────────
  任务完成。

  💡 检测到可复用模式，正在提炼技能...
  已保存技能：[数据分析-可视化报告生成]
  技能描述：输入CSV → 自动清洗 → 图表 → PDF
  技能库中已有 47 个技能。
```', array['product']::text[], array['产品界面长什么样','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.2 架构图】
```
┌─────────────────────────────────────────────────────┐
│                    用户（多渠道接入）                   │
│   终端CLI    Web UI    桌面 App    Telegram/Discord    │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   Agent 执行层                        │
│                                                      │
│   ①  接收任务                                         │
│   ②  查询技能库（有没有现成方案？）                      │
│   ③  推理执行（无现成方案则从头想）                      │
│   ④  工具调用（Web搜索/代码/浏览器/图像生成）            │
│   ⑤  结果输出                                         │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────────────┐
│    技能提炼引擎   │         │       记忆系统            │
│                 │         │                         │
│  检测：这次解法   │         │  短期记忆：对话 context   │
│  是否可复用？    │         │  长期记忆：FTS5 全文检索   │
│                 │         │  用户画像：偏好/习惯模型   │
│  是 → 结构化提炼 │         │                         │
│  → 存入技能库   │         │  跨会话持续积累            │
└─────────────────┘         └─────────────────────────┘
         │
         ▼
┌─────────────────┐
│    技能库        │
│  （可搜索、复用） │
│   agentskills.io │
│   开放标准格式    │
└─────────────────┘
```', array['product']::text[], array['架构图','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.3 "学习 Agent"的核心机制：闭环技能积累】
**普通 Agent 的问题：**
- 每次会话独立，上次学到的经验下次不可用
- 解过同样的问题100次，都是从头想
- 没有"专业化"——所有领域能力相同

**Hermes 的解法：闭合学习循环**

```
执行任务
    │
    ▼
是否发现了新的、
可复用的解法模式？
    │
   是
    ▼
自动提炼 → 结构化存储
    │
    ▼
下次类似任务：
先查技能库 → 
直接调用技能 → 
效率提升
    │
    ▼
技能在使用中被验证/修正
```

**类比：** 普通员工每次遇到新问题都重新摸索；资深员工把成功经验写成 SOP，下次直接抄。Hermes 是会自动写 SOP 的员工。', array['product']::text[], array['"学习 Agent"的核心机制：闭环技能','普通 Agent 的问题','类比','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.4 记忆系统：三层记忆】
| 记忆类型 | 技术实现 | 保存内容 | 持久性 |
|---------|---------|---------|-------|
| **短期记忆** | Context Window | 当前对话 | 会话结束即消失 |
| **长期记忆** | FTS5 全文检索 + 摘要 | 历史对话要点 | 永久 |
| **用户画像** | Honcho 用户模型 | 偏好/习惯/行为模式 | 永久，持续更新 |', array['product']::text[], array['记忆系统：三层记忆','短期记忆','长期记忆','用户画像']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.5 "学习"和"微调"的区别】
很多人会困惑：这和 Fine-tuning（微调）有什么区别？

| | 传统 Fine-tuning | Hermes 技能学习 |
|-|----------------|----------------|
| **方式** | 修改模型权重 | 在记忆库里积累知识 |
| **成本** | 需要大量数据 + GPU 算力 | 每次任务完成后自动提炼 |
| **速度** | 训练一次需要数小时/天 | 实时，任务完成就学 |
| **撤销** | 几乎不可逆 | 可以删除/修改技能 |
| **适用场景** | 改变模型基础能力 | 积累特定领域经验 |', array['product']::text[], array['"学习"和"微调"的区别','方式','成本','速度','撤销','适用场景','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.6 AI PM 三条启示】
1. **"越用越聪明"是 AI 产品差异化的核心故事。** 技能积累创造了护城河——用户用得越多，切换成本越高，产品越难被替代。  
2. **记忆系统是 Agent 产品的基础设施，不是加分项。** 没有跨会话记忆的 Agent 是"一次性的"，用户每次都要重新描述背景，体验很差。  
3. **开放标准（agentskills.io）比封闭生态更容易建立用户信任。** 技能是用户的资产，能导出就不会有数据绑架的担忧。

<a name="第六章"></a>
## 第六章：跨产品综合分析', array['product']::text[], array['AI PM 三条启示','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.1 五种范式的本质区别（1）】
```
范式维度对比图：

               谁在用
              终端用户
                 ↑
                 │
    OpenClaw     │     Hermes
   （连通供应商）  │  （自主学习）
                 │
────────────────────────────────
                 │           工具/集成
    Claude Code  │  DeepAgents
   （直接做事）   │  （给开发者用）
                 │
                 ↓
              开发者
```', array['product']::text[], array['种范式的本质区别（1）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.1 五种范式的本质区别（2）】
| 维度 | Claude Code | Codex CLI | DeepAgents | OpenClaw | Hermes |
|------|-------------|-----------|------------|----------|--------|
| **面向谁** | 开发者 | 开发者 | 开发者（造 Agent 的人）| 运维/架构师 | 终端用户 |
| **核心价值** | 直接干活 | 协议标准化 | 快速搭 Agent | 多供应商治理 | 越用越聪明 |
| **交互方式** | 对话式 | 对话+批处理 | 代码调用 | 配置+监控 | 对话式 |
| **护城河** | 模型质量+安全 | 协议生态 | 生态+社区 | 路由灵活性 | 记忆积累 |
| **最大挑战** | 安全边界 | 协议标准竞争 | 与 LangChain 重叠 | 降低配置门槛 | 知识质量保证 |', array['product']::text[], array['种范式的本质区别（2）','面向谁','核心价值','交互方式','护城河','最大挑战','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.2 三层共同结构：所有 AI Agent 产品的底层模型（1）】
仔细看这5款产品，会发现它们都有相同的三层结构：', array['product']::text[], array['层共同结构：所有 AI Agent 产品','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.2 三层共同结构：所有 AI Agent 产品的底层模型（2）】
```
┌─────────────────────────────────────────────────────┐
│                   决策层（Think）                     │
│     LLM 推理：理解意图 → 制定计划 → 选择工具            │
│                                                      │
│   核心问题：用什么模型？上下文怎么组织？多少步推理？       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   执行层（Act）                       │
│     工具调用：Shell / 文件 / API / 浏览器 / 图像生成    │
│                                                      │
│   核心问题：工具怎么隔离？失败怎么重试？权限怎么控制？     │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   记忆层（Remember）                  │
│     短期：Context Window / 长期：数据库 / 技能：索引     │
│                                                      │
│   核心问题：什么值得记？怎么检索？记忆怎么老化/更新？      │
└─────────────────────────────────────────────────────┘
```', array['product']::text[], array['层共同结构：所有 AI Agent 产品','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.2 三层共同结构：所有 AI Agent 产品的底层模型（3）】
**读这张图的方式：** 产品差异化往往聚焦在某一层：
- **Claude Code / Codex** 的创新在执行层（安全沙箱、解耦架构）
- **DeepAgents** 的创新在决策层（脚手架、子 Agent 调度）
- **OpenClaw** 的创新在执行层的上游（哪个 LLM 来决策）
- **Hermes** 的创新在记忆层（闭环技能积累）', array['product']::text[], array['层共同结构：所有 AI Agent 产品','读这张图的方式','DeepAgents','OpenClaw','Hermes','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【6.3 反复出现的设计模式（值得记住）】
1. **推理与执行分离：** 模型只管"想"，框架/沙箱管"做"。出现在 Claude Code、Codex，是 Agent 安全的基础。

2. **分层防御（Defense in Depth）：** 不依赖单点安全，多层叠加，任何一层失效其他层兜底。

3. **Context Window 是真正瓶颈：** 5款产品都在想办法压缩/卸载/管理 context，这是 2026年 AI Agent 产品最重要的工程问题。

4. **人工介入点要精准：** 不是"全自动"也不是"每步确认"，而是在"高风险操作"前暂停。

5. **MCP 生态正在成为标准：** Claude Code 和 Codex 都支持 MCP，第三方工具集成越来越标准化。

<a name="第七章"></a>
## 第七章：对你项目的启示', array['product']::text[], array['反复出现的设计模式（值得记住）','推理与执行分离','人工介入点要精准','MCP 生态正在成为标准','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【7.1 项目一（AI 物业资质审查平台）可借鉴的点】
**你的项目结构：** RAG 检索 + 规则引擎 + Claude Sonnet + 人工 override

**从 Claude Code 借鉴：审批疲劳问题**

你的平台目前是"每条规则检查结果都展示"，让设计师逐条确认。Claude Code 的发现值得关注：当用户看太多弹窗/确认项时，会停止真正阅读（确认率 93% ≈ 没有过滤）。

**建议：** 只在"置信度低"或"软规则有争议"时要求人工 override，其余自动放行但记录 log。参考 Claude Code 的 `auto` 模式逻辑——ML 分类器决定哪些值得打扰人。

**从 DeepAgents 借鉴：子任务并行**

30+ 项规则检查目前是顺序执行，可以按"独立规则组"并行化（楼层高度 vs 电梯数量 vs 停车位，彼此独立）。DeepAgents 的 spawn_subagent 模式就是解决这个的。', array['product']::text[], array['项目一（AI 物业资质审查平台）可借鉴的','你的项目结构','建议','RAG','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【7.2 项目二（改造方案生成 Agent）可借鉴的点】
**你的项目结构：** 多角色 pipeline（Planner → Writer/Renderer → Reviewer）+ 重生成循环

**从 Hermes 借鉴：技能积累减少重复推理成本**

你的 Planner 每次从头推理空间约束，但实际上同一个品牌（如绿地连锁酒店）的约束规则相对固定。可以引入技能库概念：第一个项目完成后，把"绿地品牌约束 + 常见改造方案"提炼成可复用 Skill，后续同品牌项目直接加载。

**从 Claude Code 借鉴：执行前展示计划（Plan Mode）**

你的 Planner 目前直接生成方案，设计师在最后审核。可以参考 Claude Code 的 `plan` 模式：先给设计师看结构计划（哪些区域改、改什么方向），确认后再让 Writer 展开内容，能更早发现方向偏差，减少大返工。

*资料来源：Anthropic 官方博客、OpenAI Codex GitHub、LangChain DeepAgents 文档、ArXiv 2604.14228、callsphere.ai 技术分析*', array['product']::text[], array['项目二（改造方案生成 Agent）可借鉴','你的项目结构','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.1 Compact 三档（E）】
| 阈值 | 名称 | 行为 |
|------|------|------|
| ~75% | autoCompact | 自动触发，保留关键信息 |
| ~90% | reactiveCompact | 更激进压缩，防溢出 |
| ~95% | contextCollapse | 最后防线，只留核心状态 |
**易错**：不是"满了才压缩"，是**提前三档降级**。', array['ai-tech']::text[], array['Compact 三档（E）','易错','提前三档降级']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.2 权限四档（E）】
Plan（写工具**代码层禁用**）→ Default（逐次确认）→ **Auto（AI 分类器自动审批，需 opt-in）** → Trusted（显式授权）。
**易错**：Auto ≠ Default。Auto 是分类器自动审批，Default 才是逐次人工确认。', array['ai-tech']::text[], array['权限四档（E）','代码层禁用','易错']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.3 真流式 vs 伪流式（E）】
- **真流式**：模型实时输出，前端逐字渲染
- **伪流式**：后端一次性返回，前端模拟逐字显示
**易错**：两者常被说反。真=模型实时；伪=后端一次性。', array['ai-tech']::text[], array['真流式 vs 伪流式（E）','真流式','伪流式','易错']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.4 记忆机制：Claude Code vs Codex vs Hermes（E）】
- Claude Code：CLAUDE.md + memory 文件（自己写进去），**有持久记忆**
- Codex：只有 session context，**对话结束就没了**
- Hermes：Dream 自动提取 + curator 审查，经验**不直接**喂给下一次
**易错**：CC 才有持久 memory，Codex 用完即弃（别配反）。', array['ai-tech']::text[], array['记忆机制：Claude Code vs ','有持久记忆','对话结束就没了','不直接','易错']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.5 Tombstone 墓碑机制（E）】
是**压缩标记**（提醒"这里曾有内容被压缩"），**不是**崩溃回滚。没墓碑→Agent 假装历史不存在还理直气壮；有墓碑→不确定时回头确认。', array['ai-tech']::text[], array['Tombstone 墓碑机制（E）','压缩标记','不是','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.6 RAG vs 微调 选型两问（B/E）】
选型核心问两件事：**知识更新频率 + 输出定制化程度**。
- 知识频繁更新 → RAG（换文档即可）
- 输出风格/判断逻辑深度定制且数据稳定 → 微调
**典型反例**：规范每年更新却做微调 = 错，应用 RAG。', array['ai-tech']::text[], array['RAG vs 微调 选型两问（B/E）','知识更新频率 + 输出定制化程度','典型反例','RAG','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.7 Multi-Agent 四协作 vs Anthropic 官方 5 模式】
- **四协作**（B/M7）：串行、并行、辩论、层级——讲"Agent 实例间怎么组织"
- **官方 5 模式**（E）：Prompt Chaining、Routing、Parallelization、Orchestrator-Workers、Evaluator-Optimizer——讲"单任务内 LLM 调用怎么编排"
**易错**：两套不是同一维度，不能一一对应。', array['ai-tech']::text[], array['Multi-Agent 四协作 vs A','四协作','官方 5 模式','易错','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.8 toB vs toC（A）】
| 维度 | toC | toB |
|------|-----|-----|
| 决策逻辑 | 感性（爽快好看） | 理性（ROI、数据安全） |
| 核心指标 | DAU/留存（抢时间） | 续费率/实施率（省时间） |
| 迭代 | 小步快跑 | 克制求稳 |
**易错**：toC 感性、toB 理性（常被说反）。', array['ai-tech']::text[], array['toB vs toC（A）','易错']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.9 数据分析五层级（A）】
现状 → **关系（相关性）** → **因果** → 预测 → 优化。
**易错**：关系（相关性）在因果**前面**，别把两者顺序调换。

## 通用做题策略（防配对陷阱）

1. **判断题**：把句子拆成"主体+客体+顺序+正反"，逐项跟原文比对——反转陷阱最常见（真/伪流式、先问能不能做、toB/toC 感性理性）。
2. **反向选择题**（"以下错误的/不属于的"）：先给每个选项标"对/错"，再挑唯一异类，别顺着第一个看起来对的就选。
3. **配对题**：只记每个概念**最独特的关键词**（Fork=继承复用、CCR=远程桥接、MCP=连工具、A2A=连Agent），看到关键词直接锁定。', array['ai-tech']::text[], array['数据分析五层级（A）','关系（相关性）','因果','易错','前面','判断题','反向选择题','配对题']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A1 ⭐ RAG 是什么，为什么不直接把手册塞进 prompt】
RAG = 检索增强生成：回答前先从知识库**检索**出最相关的几段原文，让 LLM 只基于这几段作答。不全塞 prompt 的三个理由：
1. **成本**：品牌手册几百页，每次审核都传全文，token 费用是检索式的几十倍；
2. **精度**：长上下文有"中间信息被忽略"（lost in the middle）问题，条款埋在第 200 页可能被模型跳过；检索后只喂 3-5 条，命中率反而高；
3. **可溯源**：检索出的片段自带出处，报告里"每条结论带依据"就是靠这个实现的——全文塞进去模型答了你也不知道它依据哪句。', array['narrative','ai-tech']::text[], array['A1 ⭐ RAG 是什么，为什么不直接把','检索','成本','精度','可溯源','RAG']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A2 embedding / bge-m3】
Embedding 把一段文字变成一个 1024 维的数值向量，**语义越接近的文本，向量距离越近**。"层高不低于3.3米"和"净高≥3.3m"字面几乎不重叠，但语义相同，所以向量空间里挨得近，检索能互相命中——这是关键词搜索做不到的。选 bge-m3 的理由：中文检索效果好的开源模型，可本地部署，嵌入这一步不用付 API 钱。', array['narrative','ai-tech']::text[], array['A2 embedding / bge-m','语义越接近的文本，向量距离越近','Embedding']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A3 pgvector 为什么不用专用向量库】
一句话：**规模用不上，运维成本先到**。业务数据（评估记录、规则表、用户）本来就在 PostgreSQL，pgvector 让向量存同一个库——少一套系统的部署、备份、权限管理。一个品牌手册切完也就几千个块，离 Milvus 那种亿级向量场景差好几个数量级。附带好处：元数据过滤（brand+tier）直接用 SQL `WHERE`，和向量检索一条语句搞定。', array['narrative','ai-tech']::text[], array['A3 pgvector 为什么不用专用向','规模用不上，运维成本先到']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A4 分块 400-600字 + overlap 80字】
- **切太大**：一块混进多个主题，检索命中后一半是无关内容，既稀释 LLM 注意力又浪费 token；
- **切太小**：一条完整条款被拦腰截断，"客房净面积不低于"和"14㎡"分在两块，检索到前半句没有数值，语义残缺；
- **overlap 80字**：防止边界处的句子被切断——重叠区让跨边界的句子在相邻两块里各保留一份完整的。
400-600 字的依据：品牌手册条款多为段落级，一个块约等于一条完整条款。', array['narrative','ai-tech']::text[], array['A4 分块 400-600字 + ove','切太大','切太小','overlap 80字']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A5 混合检索 BM25:向量 = 0.3:0.7】
两者互补：**向量抓语义，BM25 抓字面**。"层高""货梯""消防验收"是精确术语，纯向量检索可能召回"语义相似但术语不对"的条款（比如把"净高"条款排在"层高"条款前面）；BM25 保证包含确切关键词的条款不会漏。权重 0.7 偏向量，因为大多数 query 靠语义；0.3 的 BM25 做字面兜底。', array['narrative','ai-tech']::text[], array['A5 混合检索 BM25:向量 = 0.','向量抓语义，BM25 抓字面','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A6 rerank：Top-5 → 取 3】
召回和精排是**先宽后严**的分工：向量检索用近似算法，快而便宜，但排序不够准——最相关的条款可能排在第 4。所以先宽召回 5 条不漏，再用 rerank 模型（对 query-文档逐对精细打分，准但贵）重排取前 3。直接取 Top-3 就是拿"粗排序"当"终排序"，会漏掉排位吃亏的正确答案。', array['narrative','ai-tech']::text[], array['A6 rerank：Top-5 → 取 ','先宽后严','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A7 元数据硬过滤】
事故场景：格林豪泰的审核检索到了全季的"大堂面积≥150㎡"标准，物业按错误阈值被判 no-go。语义检索**分不清品牌**——两个品牌的条款措辞几乎一样，向量距离极近。所以必须在检索**之前**用结构化字段 `brand + tier` 硬过滤，把别的品牌的向量直接排除在候选之外。"先过滤再检索"，顺序不能反。

## B. 项目一 · 判断与置信度', array['narrative','ai-tech']::text[], array['A7 元数据硬过滤','分不清品牌','之前']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B1 ⭐ 为什么数值判断绝不让 LLM 做】
LLM 是概率生成模型，"13.5 是否 ≥14"这种比较它**大概率对、偶发错、且同一输入两次结果可能不同**——B 端审核产品不能接受"大概率对"。规则引擎三个优点展开：
- **可回归**：同输入永远同输出，黄金测试集才跑得起来；
- **可解释**：出错能定位到"哪条规则、哪个阈值"，而不是"模型抽风了"；
- **可审计**：结论能追责到规则表的具体版本，出了事故有账可查。
LLM 的分工是它擅长的：从非结构化文档里**取数+定位**（"客房净面积 13.5㎡ 在第 3 页这个位置"），以及经验规则的语义倾向（周边业态判断）。', array['narrative','ai-tech']::text[], array['B1 ⭐ 为什么数值判断绝不让 LLM ','可回归','可解释','可审计','取数+定位']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B2 ⭐ 置信度为什么取 min 不取平均】
**结论的可信度由最弱环节决定**（木桶原理）。反例说明：扫描件模糊，提取置信 0.4（"13.5"这个数本身可能读错了），规则判断置信 1.0（比较运算不会错）——平均 = 0.7 看起来还行，但源头数字是错的，整个结论就是错的。min = 0.4 才正确反映了真实风险，触发转人工。取平均等于让"判断很自信"掩盖了"数据不可靠"。', array['narrative','ai-tech']::text[], array['B2 ⭐ 置信度为什么取 min 不取平','结论的可信度由最弱环节决定']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B3 "能改" ≥0.85 的非对称门槛】
两种误判的代价不对称：
- 误判"**能改**"：品牌方/加盟商投入真金白银启动改造，中途发现结构上改不了——损失不可逆；
- 误判"**不能改**"：损失一个候选物业，市场上再找就是，机会成本可接受。
代价不对称 → 门槛不对称：出"能改"要 ≥0.85 的高置信，出"存疑/不能改"门槛正常。这和"漏检优先"是同一个设计哲学：**宁可保守，不可冒进**。', array['narrative','ai-tech']::text[], array['B3 "能改" ≥0.85 的非对称门槛','能改','不能改','宁可保守，不可冒进']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B4 ⭐ 漏检率为什么是最高优先指标】
- **漏检** = 不达标物业被误判 go：签约、进场之后才发现消防不合格或产权硬伤，发现得最晚、损失最大、还可能带法律风险；
- **误检** = 达标物业被误判 no-go：设计师复核时就能捞回来，损失只是几分钟复核时间。
所以漏检 ≤1% 排第一，误检可以放宽——"宁可错杀不可放过"。这也解释了为什么 FAIL 项都要人工复核而 PASS 项抽检即可。', array['narrative','ai-tech']::text[], array['B4 ⭐ 漏检率为什么是最高优先指标','漏检','误检']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B5 pdfplumber vs 视觉 OCR】
本质区别：**矢量 PDF 内嵌文本层**（文字是数据），pdfplumber 直接读出文本+坐标+表格，零识别错误、几乎零成本；**扫描件是图片**（文字是像素），只能靠视觉模型"看图认字"，有识别错误率。所以扫描件置信度封顶 medium（黄金测试集 T09 的规则）、模糊件强制 null+转人工（T11）——识别有不确定性，就不允许它伪装成确定的。

## C. 项目一 · 评估与上线', array['narrative','ai-tech']::text[], array['B5 pdfplumber vs 视觉 ','矢量 PDF 内嵌文本层','扫描件是图片']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C1 黄金测试集为什么只增不减】
它是**发版的回归护栏**：每次改 prompt、调阈值，先跑全套测试集，全过才允许上线——防止"修了新问题、复发旧问题"。只增不减：每个修复过的 badcase 都固化成一条 case，永远防复发；删掉就等于拆护栏。
两条 case 在测什么：**T05**（同页有"建筑面积2340"和"套内面积1980"）测字段消歧——取错数比取不到数更危险，因为看起来是对的；**T08**（图上什么信息都没有）测"不知道就说不知道"——必须返回 null+low，不允许猜。这是防幻觉的底线 case。', array['narrative','ai-tech']::text[], array['C1 黄金测试集为什么只增不减','发版的回归护栏','T05','T08','幻觉','badcase']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C2 badcase 回流闭环】
四步：①设计师每次 override 自动落一条标签 `{rule_id, ai_status, human_status, reason, confidence}`；②定期用标签库跑回归，统计每条规则的漏检率/误检率/"能改"假阳性率；③用真实数据校准置信度阈值（0.7、0.85 不是拍的，是要被数据修正的）；④某条硬阈值频繁被人工推翻 → 说明规则表本身要改。
一句话总结这个闭环的价值：**人工复核不是成本，是训练数据**——人工判断变成标签，模型越来越准，人工介入越来越少。', array['narrative','ai-tech']::text[], array['C2 badcase 回流闭环','人工复核不是成本，是训练数据','badcase']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C3 灰度发布】
直接全量上线一个坏版本 = 所有用户同时受影响，回滚前的损失全额承担。灰度：先放 5-10% 流量到新版本，盯三个指标——**漏检率**（质量底线）、**AI 推翻率**（设计师 override 比例，代表信任度）、**P95 延迟**（性能）——平稳再逐级扩量，异常一键切回旧版本，损失只有小流量那部分。', array['narrative','ai-tech']::text[], array['C3 灰度发布','漏检率','AI 推翻率','P95 延迟','灰度']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C4 AB 测试（17号文档）】
- **自变量**：转人工的置信度阈值（如 A 组 0.7、B 组 0.75）；
- **因变量**：漏检率 + 人工复核工作量。
实验回答的问题：阈值调高，转人工多、漏检少但提效打折；调低反之——**用数据找"漏检不升、人工量最省"的平衡点**，而不是拍脑袋定 0.7。

## D. 项目二 · 多角色 Agent', array['narrative','ai-tech']::text[], array['C4 AB 测试（17号文档）','自变量','因变量','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D1 ⭐ 为什么多角色，不用单 Prompt】
单 Prompt 的三个死穴，逐个对应：
1. **约束注入**：几十条约束混在长 prompt 里，模型会忽略其中几条——丢掉"层高3.1m"就敢在方案里做下沉吊顶，物理不可行；
2. **质量审核**：自己生成自己审 = 同源幻觉，它编的品牌标准它自己审不出来；独立 Reviewer 角色 + 独立 prompt 才构成质检；
3. **人机边界**：单 Prompt 一次性输出终稿，人只能全收或全弃；多角色在 Planner 之后有"确认计划"节点，设计师能在花大钱生成之前介入。
加一句面试金句：多角色的本质是**把不可控的一坨，拆成每段可测、可 review、可单独迭代的流水线**。', array['narrative','ai-tech']::text[], array['D1 ⭐ 为什么多角色，不用单 Prom','约束注入','质量审核','人机边界','Prompt','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D2 为什么 Analyzer 并入 Planner】
整合（报告+物业→约束）和规划（约束→章节计划）的输入输出高度重叠，拆成两个角色 = 多一次 LLM 调用 + 多一次 JSON 传递 = 多时延、多成本、多一处丢信息的风险。角色划分的判据是"**这个职责是否需要独立迭代**"，不是角色越多越显得像 Agent。整合逻辑简单稳定，不需要独立迭代，所以并入。', array['narrative','ai-tech']::text[], array['D2 为什么 Analyzer 并入 P','这个职责是否需要独立迭代','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D3 消息用 JSON 不用自然语言】
自然语言传"大堂比标准差了8个平方"，下游模型可能忽略、改写、或理解成"大概差一点"；JSON 传 `{"item":"大堂面积","value":92,"threshold":100,"gap":-8}`，字段可以程序化校验必填、数值精确不衰减、下游可直接断言。一句话：**自然语言会失真，结构化字段不会**。约束传递链路越长，这条越重要。', array['narrative','ai-tech']::text[], array['D3 消息用 JSON 不用自然语言','自然语言会失真，结构化字段不会']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D4 Writer ‖ Renderer 并行】
并行的前提是**无依赖**：两者都只消费 Planner 的 PlanPackage（章节计划 + global_style_tone），Renderer 出图靠的是结构化的空间描述和风格基调，不需要等 Writer 的正文。这是**刻意的架构设计**——如果让 Renderer 依赖 Writer 正文，就退化成串行，时延翻倍。追问"图文不一致怎么办"的答案：所以 Reviewer 是**图文同审**，不一致在审核层拦截。', array['narrative','ai-tech']::text[], array['D4 Writer ‖ Renderer','无依赖','刻意的架构设计','图文同审']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D5 熔断 ≤2 次】
有些 critical 靠重写永远解决不了——标准间物理面积差 1㎡，模型改一万遍文字，空间也不会变大。这类问题需要**人做取舍**（减一间房换面积，还是放弃该物业），不是模型能力问题。≤2 次熔断防死循环烧 token；熔断转人工时把 Reviewer 的 `rewrite_hint` 一起带过去，设计师不用从零看起。图、文两条独立闭环各自熔断，互不阻塞。', array['narrative','ai-tech']::text[], array['D5 熔断 ≤2 次','人做取舍']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D6 ⭐ 防幻觉三道闸，去掉任何一道会怎样】
1. **去掉约束全量结构化传递** → 约束靠模型在长上下文里"记住"，多轮之后丢约束，输出物理不可行方案（在 3.1m 层高里设计 2.8m 吊顶+新风管道）；
2. **去掉硬指标走规则引擎** → Writer 和 Reviewer 是同类 LLM，会**同源幻觉**：生成时编一个房型配比，审核时觉得"看起来合理"放行——两个 LLM 互审防不了共同的错觉，只有确定性规则能拦；
3. **去掉结论带出处** → 模型编造"格林豪泰标准要求大堂挑空"这类不存在的条款，设计师无法核验，发现一次编造，整个产品信任崩塌。', array['narrative','ai-tech']::text[], array['D6 ⭐ 防幻觉三道闸，去掉任何一道会怎','去掉约束全量结构化传递','去掉硬指标走规则引擎','同源幻觉','去掉结论带出处','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D7 Prompt 七模块】
每个模块防一类事故：**Role** 防串戏（Planner 不写正文不出图）；**Goal** 防跑题；**Input** 定义输入 schema，防拿到脏数据硬跑；**Workflow** 分步骤防跳步漏项（步骤0整合→…→步骤7组装）；**Constraints** 红线清单（禁止猜数、冲突以 report 为准）；**Examples** few-shot 锚定输出——**少了它输出格式漂移最严重**，JSON 时好时坏、字段名随机变化，下游解析直接崩；**Output** 给出完整 JSON Schema 供程序断言。

## E. 项目二 · 成本与信任', array['narrative','ai-tech']::text[], array['D7 Prompt 七模块','Role','Goal','Input','Workflow','Constraints','Examples','少了它输出格式漂移最严重']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【E1 上下文压缩】
Writer 写第 6 章不需要前 5 章全文，只需要知道前文大意保持连贯——所以每章写完压 200 字摘要，≥5 章时只传最近 3 章全文+其余摘要，单次调用 token 降约 75%。**丢信息的风险怎么兜**：压缩的只是正文叙述；constraints（层高、房数、面积缺口）**永不压缩、全量随每次调用传递**——细节丢了影响文笔，约束丢了出事故，所以区别对待。', array['narrative','ai-tech']::text[], array['E1 上下文压缩','丢信息的风险怎么兜','永不压缩、全量随每次调用传递']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【E2 大小模型分层】
判断依据：**任务是收敛的还是发散的**。收敛任务（字段映射、整合、硬校验）有标准答案，用规则引擎或小模型——零幻觉还便宜；发散任务（章节规划、方案写作）需要推理和创造，才值得上大模型。反着用的后果：全用大模型 = 成本爆炸且确定性环节引入幻觉风险；全用小模型 = 方案质量不够设计师采纳率崩。', array['narrative','ai-tech']::text[], array['E2 大小模型分层','任务是收敛的还是发散的','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【E3 prompt 缓存】
System prompt（角色定义 + 规则 + Examples）每次调用内容完全一样，占了 prompt 的大头；供应商（如 Claude）对命中缓存的部分按约 1 折计费。每次真正变化的只有用户输入（本次物业的 PlanPackage）。适合缓存的判据：**静态、重复、够长**。', array['narrative','ai-tech']::text[], array['E3 prompt 缓存','静态、重复、够长']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【E4 采纳率 ≥70% 怎么度量】
口径必须事先钉死，否则就是拍脑袋数字。文档口径：**设计师只做局部微调即签发 = 采纳**；改动结构/推翻重写 = 不采纳。怎么客观化：override 全程留痕，用"设计师改动的字段数/幅度"量化"局部微调"和"大改"的界线，采纳率逐月公示——这同时也是 Q5（设计师信任）的答案之一：让用户看得到模型在变好。

## F. 通用 · 两个项目的对比故事', array['narrative','ai-tech']::text[], array['E4 采纳率 ≥70% 怎么度量','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【F1 ⭐ 为什么项目一用 pipeline、项目二用 Agent】
判据一句话：**看不确定性的"局部"有多大**。
- 项目一：任务收敛——字段提取→阈值比对→出结论，路径完全固定，不确定性只集中在"提取"这一个环节（局部小）→ 固定 pipeline，每步可控可测可回归；
- 项目二：任务发散——章节怎么划、方案怎么写、图怎么出，全程都不确定（局部大）→ 需要规划-生成-审核的动态协作，上多角色 Agent。
用错的后果：项目一上 Agent = 给确定性任务引入不必要的不可控（审核结果每次不一样，B 端不能接受）；项目二用 pipeline = 只能出模板填空，产不出设计师愿意署名的方案。', array['narrative','ai-tech']::text[], array['F1 ⭐ 为什么项目一用 pipelin','看不确定性的"局部"有多大','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【F2 两个项目的字段契约】
Planner 的 Input 直接消费项目一的 review_report JSON：`verdict`（go/no-go）、`items[]`（item/value/threshold/**gap**/status，如大堂面积 92/100/-8/warn）、`feasibility[]`（issue/verdict/note，如"大堂面积不足/可改/前台东移释放8㎡"），再叠加 property 物业条件，整合成 constraints。**契约锁定的价值**：两个项目可以独立迭代，只要 JSON schema 不破坏，项目一改内部实现不影响项目二——这就是"产品矩阵"和"两个孤立 demo"的区别。', array['narrative','ai-tech']::text[], array['F2 两个项目的字段契约','gap','契约锁定的价值']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【F3 越权防护】
- **水平越权**：设计师 A 把 URL 里的 `evaluation_id` 改成 B 的 → 必须拿不到。防护在查询层强制 `WHERE owner_id = current_user`；**只验"这条记录存在"不验"归属谁"，就是漏洞本身**。
- **垂直越权**：普通设计师改请求去调规则阈值接口 → 拦截，规则表写操作只开放管理员且记审计日志。
面试加分句：越权校验必须做在**服务端每个接口**上，前端把按钮藏起来不算防护。

## 使用建议

1. 别直接背答案——先自己答一遍录音，再对照差在哪，差的那句才是你真正没懂的；
2. 每个 ⭐ 概念，试着给"完全不懂技术的人"讲 30 秒版本，讲不出来就是还没内化；
3. 全部过完后来找我 grill-me，我会换着角度追问（比如"你的 min 置信度在什么情况下会失效"），验收是否真懂。', array['narrative','ai-tech']::text[], array['F3 越权防护','水平越权','垂直越权','服务端每个接口']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.1 核心决策与业务理由】
| 决策 | 选择 | 为什么这样做（业务场景） | 挂的知识点 |
|------|------|------------------------|-----------|
| **形态选型** | Workflow 而非 Agent | 审核步骤固定（解析→提取→比对→报告），规则明确、无需 AI 自主规划下一步。用决策三问：①步骤能预定=能 ②要 AI 自主判断=不要 ③失败代价高=要加限制 → 指向 Workflow | E 决策三问 / B Workflow vs Agent |
| **规则 vs 模型分工** | 数值判断走规则引擎，LLM 只取数+定位 | 面积/层高/电梯配比是硬数值（大堂≥100㎡），必须精确比对不能靠模型"觉得"。把 LLM 限制在"提取字段+定位出处"，判定交确定性规则引擎，保证可控可解释、可回归测试 | E 工具三层 / C 可解释 |
| **RAG+规则双轨** | 硬指标走规则表，品牌手册走 RAG | 审核依据是**混合分布**：硬指标是结构化数值（走规则表精确比对）；品牌设计手册是非结构化且持续更新（走 RAG 语义检索，换文档即可不重训） | B RAG vs 微调选型 |
| **召回优先** | 宁可错杀不可放过 | 两类错代价不对称：漏检（不达标判 go）→ 放进改不动的物业、加盟失败、**不可逆**；误检（达标判 no-go）→ 可人工复核挽回。所以优先保召回，低置信度输出"需现场尽调"而非直接 go | C 灰色地带 / 降级 |
| **两级置信度** | `min(提取, 判断)`，"能改"门槛≥0.85 | 一条结论的可信度取决于最弱环节——提取错了后面全错。扫描件提取准确率从 90% 跌到 60-70%，所以扫描件强制转人工 | E fail-safe / C 置信度 |
| **不用 DeepAgent** | 固定 pipeline | 本项目每一步都确定（不存在"局部不确定有多大"的问题），上 Agent 框架只增加不可控性。判据：不确定的局部有多大——项目一几乎为零 | E 隔离>并发 |', array['narrative']::text[], array['核心决策与业务理由','形态选型','规则 vs 模型分工','RAG+规则双轨','混合分布','召回优先','不可逆','两级置信度']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.2 模拟业务场景（讲项目时的"真实感"素材）】
**场景 1 · 为什么锁死"数值走规则引擎"**：

**场景 2 · 为什么召回优先（漏检代价不可逆）**：

**场景 3 · 为什么扫描件强制转人工**：', array['narrative']::text[], array['模拟业务场景（讲项目时的"真实感"素材）','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【2.3 跨部门协作流程（证明"落地过"）】
**四层设计决策对应的协作分工**（来自关键决策文档，每条都标了负责人）：

| 环节 | PM（我）做什么 | 找谁协作 | 协作내容 |
|------|--------------|---------|---------|
| 规则沉淀 | 把审核逻辑写成三层规则表（硬10/软5/经验5） | **品牌方设计师** | 逐条确认阈值（大堂多少㎡、层高多少米），哪些能量化、哪些必须留人工 |
| 提取准确率 | 定义"矢量走 pdfplumber、扫描件走 OCR" | **算法工程师** | 先问"扫描件能提到什么准确率"，评估技术可行性再定 MVP 范围（只收 PDF） |
| 权限设计 | 定义三角色 RBAC + `owner_id` 越权校验 | **开发** | 明确设计师 A 不能看 B 名下其他品牌记录；多租户 `brand_id` 硬隔离 |
| 上线风控 | 定 QoS 告警分级（P0/P1/P2） | **开发 + 运营** | P0 服务不可用 oncall 15min；P1 推翻率>5% 24h 排查 |
| BadCase 迭代 | 设计师 override 自动进 BadCase 池 | **运营** | 每周出 Top 10 失败类型报告，作为 Prompt 迭代和规则更新输入 |

**关键协作故事（可讲）**：

# 三、项目二：为什么这样做（决策—理由—场景—协作）', array['narrative']::text[], array['跨部门协作流程（证明"落地过"）','四层设计决策对应的协作分工','品牌方设计师','算法工程师','开发','开发 + 运营','运营','关键协作故事（可讲）']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.1 核心决策与业务理由】
| 决策 | 选择 | 为什么这样做（业务场景） | 挂的知识点 |
|------|------|------------------------|-----------|
| **形态选型** | Multi-Agent 而非单 Agent/Workflow | 方案生成是创造性任务、局部不确定（怎么分区没有唯一解），需要 AI 自主规划；但又要分角色隔离（规划/写字/出图/审核各管一段）。判据：**不确定的局部足够大** → 用 Agent，且拆多角色 | E 单vs多判断 / B Multi-Agent |
| **用 DeepAgents** | 而非固定 pipeline | 与项目一相反——项目二局部不确定大（设计推理），适合 middleware 可组合的 Agent 框架 | E DeepAgents 组合顺序 |
| **消息用 JSON** | 而非自然语言 | 全链路传空间约束（层高/面积/差值），自然语言会丢失或产生歧义，下游无法精确校验。JSON 方便解析、流程控制、回归测试；只有最终方案稿用自然语言 | B 结构化输出 / E Message Adapter |
| **Analyzer 并入 Planner** | 不独立设角色 | 整合上游报告产出的约束**直接**服务规划，同一角色内闭环——少一次跨角色 LLM 往返、少一处字段错位。独立设角色只在"整合逻辑极重需单独迭代"时才划算 | E 隔离>并发（不为拆而拆） |
| **Writer‖Renderer 并行** | 不串行 | 文字方案和效果图之间无数据依赖（Renderer 只需 Planner 给的风格基调+待渲空间），并行把生成阶段时延砍半。前提：Planner 先把风格和空间定死 | E 编排五模式-并行 |
| **图生图而非文生图** | 锚定品牌基准图 | 文生图风格漂移、产不出"像格林豪泰的"图；图生图以品牌基准图为控制条件保证 VI 一致 | B 多模态 / C 幻觉防护 |
| **工具契约红线** | 每个角色禁止调用清单 | Writer 禁止出图/改约束，Renderer 禁止改文字/判达标，Reviewer 无签发权——防止角色越界、结果不可控 | E 工具治理 / 权限结构化 |
| **critical/minor 两级 + ≤2次熔断** | 不无限重写 | critical（超层高/动承重/配比不达标/风格严重跑偏）触发重写，minor 放行交人工；重写≤2 次转人工，避免图文双闭环死循环 | E fail-safe / C 降级 |', array['narrative']::text[], array['核心决策与业务理由','形态选型','不确定的局部足够大','用 DeepAgents','消息用 JSON','直接','图生图而非文生图','工具契约红线']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.2 模拟业务场景（讲项目时的"真实感"素材）】
**场景 1 · 为什么 Analyzer 并入 Planner（不为拆而拆）**：

**场景 2 · 为什么图文必须同审**：

**场景 3 · 为什么两个不可跳过的人工节点**：', array['narrative']::text[], array['模拟业务场景（讲项目时的"真实感"素材）','场景 2 · 为什么图文必须同审']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.3 跨部门协作流程（证明"落地过"）（1）】
| 环节 | PM（我）做什么 | 找谁协作 | 协作内容 |
|------|--------------|---------|---------|
| 接口对齐 | 锁定项目一→项目二的字段 schema | **项目一 PM / 开发** | Planner 消费项目一报告字段，schema 不统一就要人工重录——接口契约必须先于建模锁定 |
| 角色边界 | 定义 4 角色工具契约（可调用+禁止清单） | **开发** | 明确每个 Agent 能调什么工具、禁调什么，写进工具契约文档 |
| 图生图 | 定"图生图锚定品牌基准图" | **算法 + 品牌设计中心** | 需要品牌方提供风格基准图库；算法评估图生图风格一致性能到什么程度 |
| 质量门 | 定采纳率≥70%、修改量"局部微调" | **设计师** | 用真实方案做剔除测试校准，若采纳率上不去，20min 提效会被返工抵消 |
| 熔断降级 | 定 critical 重写≤2 次转人工 | **开发** | 防止图文双闭环死循环；Renderer 慢要设超时（先出文字审核、图后补） |

**关键协作故事（可讲）**：

# 四、两个项目对比讲法（面试高频：为什么一个 Workflow 一个 Agent）

这是最能体现"想过为什么"的对比点，务必讲清：', array['narrative']::text[], array['跨部门协作流程（证明"落地过"）（1）','项目一 PM / 开发','开发','算法 + 品牌设计中心','设计师','关键协作故事（可讲）','Agent','微调']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【3.3 跨部门协作流程（证明"落地过"）（2）】
| 维度 | 项目一（Workflow） | 项目二（Multi-Agent） |
|------|-------------------|----------------------|
| 任务性质 | 确定性核对（规则明确） | 创造性推理（方案无唯一解） |
| 局部不确定性 | 几乎为零 | 大（怎么分区、怎么排布） |
| 选型判据 | 步骤能预定→Workflow | 需 AI 自主规划→Agent |
| 框架 | 固定 pipeline（不用 DeepAgent） | DeepAgents（局部不确定大才划算） |
| 控制权 | 在流程设计者手里 | 部分移交 AI，但留两个人工关卡 |

**一句话总结（可背）**：

# 五、可能的面试题 + 回答要点', array['narrative']::text[], array['跨部门协作流程（证明"落地过"）（2）','一句话总结（可背）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.1 项目一高频题】
| 面试题 | 回答要点（★核心） |
|--------|------------------|
| 为什么用 Workflow 不用 Agent？ | ★决策三问：步骤能预定/不需 AI 自主判断/失败代价高需加限制 → Workflow；能用 Workflow 就不用 Agent |
| 怎么保证审核结果准确/可解释？ | ★数值判断走规则引擎（精确比对），LLM 只取数+定位出处；每条结论回溯到"提取值+规则条文" |
| 为什么召回优先而不是精确率优先？ | ★两类错代价不对称：漏检不可逆（放进改不动的物业），误检可挽回；漏检率≤1% 是最高优先级 |
| 怎么处理 AI 提取不准？ | ★两级置信度 min(提取,判断)；扫描件准确率低强制转人工；低置信度输出"需现场尽调"不直接 go |
| 冷启动没数据怎么办？ | ★规则表是人工沉淀的品牌标准（不依赖历史数据）；改造案例回测集用 20-30 份真实历史案例摸底 |
| 这个产品的壁垒/差异化在哪？ | ★不是通用 OCR，是垂直酒店的规则驱动判定引擎；壁垒在结构化品牌规则表+改造案例回测集（数据资产），不在模型 |
| 怎么衡量成功？ | ★提效 3h→20min、漏检率≤1%、矢量提取≥90%、成本≈¥1/份 |', array['narrative']::text[], array['项目一高频题','Agent','召回','冷启动']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.2 项目二高频题】
| 面试题 | 回答要点（★核心） |
|--------|------------------|
| 为什么用 Multi-Agent？怎么分角色？ | ★局部不确定大（创造性推理）→ Agent；Planner 规划/Writer 写字/Renderer 出图/Reviewer 审核，各管一段做隔离 |
| 为什么消息用 JSON 不用自然语言？ | ★全链路传空间约束（层高/面积/差值），自然语言丢失或歧义，下游无法校验；只有最终方案稿用自然语言 |
| 为什么把 Analyzer 并进 Planner？ | ★整合是确定性映射、直接服务规划，同角色闭环少一次往返少一处错位；隔离要有价值，不为拆而拆 |
| Writer 和 Renderer 为什么并行？ | ★两者无数据依赖，并行把生成时延砍半；前提 Planner 先把风格和待渲空间定死 |
| 怎么防止 Agent 越界/失控？ | ★工具契约红线（每角色禁调用清单）+ critical/minor 两级 + 重写≤2 次熔断转人工 |
| Reviewer 也是 LLM，怎么保证它审得对？ | ★图文同审防脱节；物理硬指标（承重/层高/配比）叠确定性规则校验兜底同源幻觉 |
| 采纳率上不去怎么办？ | ★用真实方案做剔除测试校准；建品牌风格锚定图库+生成后人工选图兜底；守住"初步方案"边界不越界做深化 |', array['narrative']::text[], array['项目二高频题','Agent','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.3 两项目串讲题（最能加分）（1）】
| 面试题 | 回答要点 |
|--------|---------|
| 这两个项目什么关系？ | ★上下游：项目一"能不能做"、项目二"怎么改"，共用物业字段 schema，端到端业务链路思维 |
| 为什么一个 Workflow 一个 Agent？ | ★判据是"不确定的局部有多大"（见第四节对比表）——这是最能体现选型能力的点 |
| 如果重做，你会改什么？ | ★诚实答：9x/70% 采纳率都是待验证假设，需真实案例摸底；接口 schema 应更早锁定 |

# 六、防翻车提醒（面试时注意）', array['narrative']::text[], array['两项目串讲题（最能加分）（1）','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【5.3 两项目串讲题（最能加分）（2）】
1. **数字都要带假设依据**：9x 提效、70% 采纳率、漏检率≤1% 都是**待验证目标**，讲的时候主动说"这是待真实案例校准的假设"，不要说成已实现的结果（诚实反而加分）。
2. **别把"能做"说成"已上线"**：这两个是作品集项目（PRD+架构+原型完成），讲的时候聚焦"我的产品思考和设计决策"，别夸大成"已服务 X 个客户"。
3. **场景边界要守住**：项目二只出"初步方案"，被追问时明确"不做施工图/预算/深化设计"，交付物标注"初步参考、不作施工依据"——这体现边界意识。
4. **协作故事讲一个就够**：不用把所有部门都提一遍，挑"MVP 范围跟算法博弈"（项目一）或"字段 schema 跟上游对齐"（项目二）讲透一个，比泛泛而谈更可信。
5. **被问技术细节别硬撑**：pdfplumber、bge-m3、pgvector 这些能说清用途即可（提文字坐标/中文 embedding/向量库），深了就说"具体实现和算法一起定的，我负责的是选型判断和边界定义"。', array['narrative']::text[], array['两项目串讲题（最能加分）（2）','数字都要带假设依据','待验证目标','别把"能做"说成"已上线"','场景边界要守住','协作故事讲一个就够','被问技术细节别硬撑']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A-产品经理通识思维导图 · ① 会看：评价产品四维度（产品视角，非用户视角）】
├─ ① 会看：评价产品四维度（产品视角，非用户视角）
│   ├─ 商业价值：广告 / 企业付费 / 知识付费 / API付费 / 大数据分析
│   ├─ 用户体验：有用性 / 易用性 / 情感响应
│   ├─ 技术实现：Netflix大数据编剧《纸牌屋》、智能推荐算法
│   ├─ 可持续：Airbnb 生态不断拓展；阿里中台（数据服务跨产品线通用）
│   └─ 三个面试案例（背诵框架）
│       ├─ 墨迹天气商业价值：先定性（场景数据服务公司）→ 三层变现
│       │   （场景化广告→B端天气数据SaaS/API→跨界生活服务分发）→ 想象空间
│       ├─ 小宇宙用户体验：一个洞察串三个细节
│       │   （时间戳评论=同频共鸣 / 人工精选降低发现成本 / 干净交互与社区氛围）
│       └─ 微信可持续：社交关系链（数字身份证）→ 小程序（服务容器）→ 克制进化观
│', array['product']::text[], array['A-产品经理通识思维导图 · ① 会看：']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A-产品经理通识思维导图 · ② 会做：职责与 toB/toC 判断】
├─ ② 会做：职责与 toB/toC 判断
│   ├─ PM职责：产出·品质·经验·管理，负责全产品生命周期
│   ├─ AI时代要求：C端（AI技术理解/趋势认知/工具使用/项目产出）
│   │   B端更高（知识图谱、NLP、业务+AI探索、AI指标定义、数据分析）
│   └─ toB vs toC 四维区别（面试高频）
│       ├─ 用户是否=决策者：C端同一人 / B端采购·使用·IT分离
│       ├─ 决策逻辑：C端感性（爽快好看）/ B端理性（降本增效、安全合规）
│       ├─ 核心指标：C端DAU留存（抢用户时间）/ B端续费率实施率（省客户时间）
│       ├─ 迭代节奏：C端小步快跑 / B端克制求稳
│       └─ 类比：toC像谈恋爱（一见钟情），toB像结婚（稳定靠谱）
│', array['product']::text[], array['A-产品经理通识思维导图 · ② 会做：']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A-产品经理通识思维导图 · ③ 会做：PRD 撰写九模块】
├─ ③ 会做：PRD 撰写九模块
│   ├─ 项目背景（秘塔AI查行业趋势报告）
│   ├─ 产品目标：量化（用户价值/产品价值/商业价值/社会价值）
│   ├─ 业务调研：用户调研报告（问卷筛选→深度访谈）+ 竞品分析报告
│   ├─ 核心场景：用户旅途分析 + 用户故事（3W：goal/value，分人群）
│   ├─ 业务流程：流程图 / 泳道图（跨职能B端用）/ 时序图（研发画）
│   ├─ 产品规划：架构图（1-2级菜单）→ 功能清单（3-4级）→ 排期里程碑（OKR+MVP优先级）
│   ├─ 产品设计：交互原型图
│   ├─ 数据埋点：AARRR模型（获取-激活-留存-变现-自传播）
│   └─ 风险评估
│', array['product']::text[], array['A-产品经理通识思维导图 · ③ 会做：']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A-产品经理通识思维导图 · ④ 会看：竞品分析八步】
├─ ④ 会看：竞品分析八步
│   ├─ 为什么做：学习借鉴 / 支持决策 / 预警避险
│   ├─ 明确目标：战略/规划/设计/运营四阶段
│   ├─ 选择竞品：直接/间接/潜在（用户体验五层次做维度）
│   ├─ 信息搜集：C端好找（七麦数据）
│   ├─ 功能对比（要真正用过）→ 市场表现 → 分析方法（SWOT/比较法/竞品画布/PEST）
│   └─ 总结报告：优势借鉴 + 自身核心竞争力
│', array['product']::text[], array['A-产品经理通识思维导图 · ④ 会看：']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【A-产品经理通识思维导图 · ⑤ 会证：数据分析】
└─ ⑤ 会证：数据分析
    ├─ 为什么：通过数据衡量、了解、改进产品
    ├─ 难度五层级：现状(发生了什么)→关系(相关性)→因果(为什么)→预测(会怎样)→优化(怎么做最好)
    ├─ 怎么做：先定指标 → 埋点设计（4W1H拆解）→ 再分析
    ├─ 分析思路四种：总量 / 差距 / 相关 / 趋势
    └─ 用AI做数据分析：结构化Prompt模板（角色+任务+业务背景变量+输出三段式：洞察建议/具体分析/数据概括+字数约束）', array['product']::text[], array['A-产品经理通识思维导图 · ⑤ 会证：','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M1 全局认知：AI时代PM的坐标系】
├─ M1 全局认知：AI时代PM的坐标系
│   ├─ 豆包产品拆解：护城河不在模型，在推理成本+字节分发；三层商业模式（C端免费圈用户/B端火山引擎API/生态协同）
│   │   └─ 增长飞轮：流量→用户→数据→模型迭代→体验→留存；死穴=粘性（用完即走）
│   ├─ 传统AI vs 大模型：一任务一模型 → 一模型多任务
│   │   └─ PM三变化：固定流程设计→AI工作流设计 / 需要模型选型能力 / 评价标准变为回答质量·幻觉率
│   └─ AI PM五能力：技术理解 / Prompt设计 / 数据思维 / 效果评估 / 伦理意识
│', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M1 全局','Prompt','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M2/3 大模型核心原理】
├─ M2/3 大模型核心原理
│   ├─ Token：计费单位；输出比输入贵4-5倍；成本测算=（输入token+输出token）×单价×调用量
│   ├─ Embedding+向量库：句子→多维浮点数组（语义坐标）；余弦相似度衡量语义相近（建筑vs建筑0.53，建筑vs饮食0.05）
│   │   └─ 关键词搜索解决"字一样"，Embedding解决"意思一样"；中小规模选pgvector，千万级才上Milvus
│   ├─ Transformer：基于前文预测下一个词；自注意力机制（边读边找重点，费资源）
│   ├─ 参数三件套：温度（发散/稳定）/ Top-K（候选池大小）/ Top-P（累计概率截断）
│   ├─ GPT vs BERT：生成式Decoder（对话创作）vs 理解式Encoder（分类NER）
│   ├─ 参数量：非唯一指标，看实际效果和成本，不迷信
│   └─ 幻觉：根源=预测下一词而非检索事实
│       ├─ 检测：多模型交叉验证 / 要求给信息源URL / 置信度自评 / 事实核查
│       └─ 防护：RAG限范围 / 高风险人工审核 / 分级信任 / 可追溯设计（宁可拒答不editorial乱答）
│', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M2/3 ','RAG','Token','Embedding','幻觉']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M4 Prompt工程】
├─ M4 Prompt工程
│   ├─ 六要素：角色设定（激活知识子空间）/上下文/任务描述/输出风格/输出格式/学习资料
│   ├─ RTF框架：Role-Task-Format（最常用）
│   ├─ 高级技巧：Few-shot（2-3范例）/ CoT（让AI输出reason激发深度思考）/ 结构化输出JSON（=数据接口标准）
│   ├─ 提高输出稳定性五招：明确角色+拆解步骤CoT+指定JSON+Few-shot+约束条件
│   ├─ Prompt工程化：版本管理（Git/平台）+ 评估体系四层（标准测试集/评分维度/版本管理/自动打分）
│   └─ System Prompt三层：平台级（全局约束+注入防御）→ 功能级（任务范围）→ 会话级（动态）
│       └─ 注入防御：输入过滤/角色锁定/边界明确/输出检查 + 规则优先级（安全>角色>业务>用户）
│', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M4 Pr','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M5/6 RAG与知识增强】
├─ M5/6 RAG与知识增强
│   ├─ 为什么：训练数据有时间边界 / 幻觉 / 不了解内部数据
│   ├─ 离线：文档处理(OCR)→分块（先固定长度再按效果换）→Embedding→入库
│   ├─ 在线：向量检索→Top-K初筛(3-8个)→Reranking精筛→拼Prompt→生成
│   ├─ 优化优先级：数据预处理 > chunking > 混合检索+rerank > query改写 > 多步检索（越往后越贵）
│   ├─ 进阶：Agentic RAG（想清楚再查、查完再判断、不够再查）/ GraphRAG（知识图谱补关系推理）/ 多模态RAG
│   ├─ 微调：改的是输出格式·术语·风格；三种方式（全量/LoRA改<1%参数/QLoRA再加量化）
│   │   └─ 原则：先把Prompt和RAG做到极致，确认瓶颈在模型再微调；质量>数量
│   └─ 落地常见坑：切分粗细 / Embedding选错 / 只看召回不看准确 / 无相似度阈值 / 无数据更新Pipeline
│', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M5/6 ','RAG','Agent','Prompt','Embedding','微调','幻觉','召回']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M7-9 Agent架构与设计模式】
├─ M7-9 Agent架构与设计模式
│   ├─ 三层级：Chatbot → Copilot → Agent（控制权逐步移交）
│   ├─ 五要素：LLM大脑 / 感知环境 / 分析决策（与Workflow的核心区别）/ 调用工具 / 经验积累
│   ├─ 四大组件
│   │   ├─ 规划：Plan-then-Execute（大框架）+ ReAct（每步内部）混合使用
│   │   ├─ 记忆：工作记忆存中间文档，长期记忆写CLAUDE.md/memory.md
│   │   ├─ 工具：核心机制Function Calling；MCP缺点=占上下文
│   │   └─ 行动：每一步都应有明确目的
│   ├─ 上下文工程：让AI在正确时间拿到正确信息；趋势=Prompt(23)→RAG(24)→Context(25)→Agent Engineering(26)
│   ├─ Multi-Agent四协作：串行（写作+审核）/ 并行（多竞品调研）/ 辩论（投资决策）/ 层级（boss分配）
│   ├─ 三产品架构：Codex（单体长程+GitHub云端）/ Claude Code（可编程编排+本地深度集成）/ OpenClaw（全天候自主+自部署）
│   └─ Agent判断口诀：风险点不固定、需逐条判断、要对漏看负责→Agent；固定抽取→Workflow；人主导→Copilot；单点问答→Chatbot
│', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M7-9 ','RAG','Agent','Prompt','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【B-AI技术理论思维导图 · M10 Workflow编排 + MCP/A2A协议】
└─ M10 Workflow编排 + MCP/A2A协议
    ├─ Workflow三要素：数据准备/模型推理/结果验证；适用固定流程垂类场景
    ├─ 平台趋势：技术团队转代码化（LangGraph/SDK），Dify/Coze仍是非技术团队主力；混合用（Dify做POC→代码重写）
    ├─ 产品化四件事：性能优化（模型分级/并行/缓存）/ 错误兜底 / 监控告警（基线→三级告警）/ 版本管理（灰度10%）
    ├─ MCP：三角色（Client/Server/Protocol）+ Server三能力（Resources/Tools/Prompts）
    │   ├─ 通信四步：initialize → tools/list → tools/call → result/error（所有MCP都这个模式）
    │   ├─ 生产部署：超时回退 / 限流（令牌桶）/ Bearer Token+最小权限 / 缓存换成本
    │   └─ 企业MCP私服：公共Registry→审核→私服→分发（类比npm私服）；敏感数据不过公有平台
    ├─ A2A：Agent Card名片 / Task状态机（可持续很久，区别MCP一次性）/ Message流式 / Artifact交付物
    │   └─ 选型口诀：连工具用Function Calling/MCP，连Agent用API/A2A；内部协作API，跨系统A2A
    └─ Token优化三方案：Dynamic Tool Loading / Skill封装 / Tool Router → 组合成"Router→Skill→Tool"架构', array['ai-tech']::text[], array['B-AI技术理论思维导图 · M10 W','Agent','Prompt','MCP','Token','灰度']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ① 为什么特殊（9.1）：三个特性】
├─ ① 为什么特殊（9.1）：三个特性
│   ├─ 不确定性（同样输入≠同样输出）/ 数据驱动非规则（理解语义非关键词）/ 持续进化非一次交付
│   └─ 管理不确定性四招
│       ├─ 指标留弹性空间（三级指标）
│       ├─ 人机协作：置信度标注，低置信度转人工
│       ├─ 回答时展示置信度
│       └─ 降级方案（代价递增、控制权转移）：AI自兜底（标注不确定）→ 转人工/权威来源 → 规则固定模板 → 全量人工
│           └─ 原则：宁可功能弱，不能给错的结果；每级让用户清楚"现在谁在负责"
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ① 为什么']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ② 需求到定义（9.2）】
├─ ② 需求到定义（9.2）
│   ├─ 三维度：用户需求（痛点多痛）/ 商业可行性（ROI）/ 技术可行性（AI能到什么程度）
│   ├─ 四象限：业务价值×AI适合度 → 优先落地 / 快速试验 / 战略投入 / 暂缓观察
│   └─ AI产品PRD四个特殊章节（区别传统PRD的核心）
│       ├─ AI能力边界：能做 / 不能做 / 灰色地带（★最重要——厂商不说、用户踩坑最多、信任崩塌最快）
│       ├─ 数据需求与质量标准：来源/量/更新频率/安全
│       ├─ 评估指标与基线：采纳率/响应时间/满意度/转人工率（只写目标不写基线=坑）
│       └─ 异常处理与降级策略（只写"转人工"=坑）
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ② 需求到']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ③ 原型验证（9.3）】
├─ ③ 原型验证（9.3）
│   ├─ PoC概念验证（比MVP更早）：测试用例（场景×难度×用户类型）→评分→统计→决策
│   ├─ 原型三问题：等待体验（流式输出/进度提示）/ 多结果展示（默认最优+换一个，≤3个）/ 错误处理（标置信度）
│   └─ 用户测试四方法：绿野仙踪WoZ（真人扮AI故意出错）/ 错误注入 / 信任度量表 / A/B对比
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ③ 原型验','A/B']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ④ 迭代优化（9.4）】
├─ ④ 迭代优化（9.4）
│   ├─ 五核心指标：采纳率（直接/修改后）/ 编辑距离 / 重试率（高→修稳定性非平均质量）/ 任务完成率 / 满意度
│   ├─ BadCase闭环：收集入库 → 分类（知识/格式/理解/遗漏/风格）→ 5WHY根因 → 回归测试+灰度
│   │   └─ 优先级 P0-P3 = 频率×严重度；BadCase Review会议
│   ├─ AI产品A/B三不同：周期更长（4周+）/ 指标更复杂（+采纳率重试率）/ 变量更多（模型/Prompt/后处理）
│   ├─ 迭代SOP：监控→异常→收集BadCase→分级→根因→方案→A/B→灰度(5%-20%-全量)→回归→更新基线
│   └─ 三个停止信号：边际效益递减 / 指标冲突 / 超过人类基线
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ④ 迭代优','Prompt','灰度','A/B']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ⑤ 项目全流程（M11-2）】
├─ ⑤ 项目全流程（M11-2）
│   ├─ 该不该上AI·8问清单：输入输出明确？有数据？错了多严重？容忍多大错误率？人工多久？有现成方案？预算？速度要求？
│   │   └─ 立项/PRD评审/开发中期/上线复盘 反复使用
│   ├─ 技术预研：真实数据（勿用demo代替）/ 高中低各测一个模型 / Prompt版本管理
│   ├─ PM与算法沟通五件套：业务背景 / IO Schema / 评估指标 / 异常边界 / 测试样例≥20个
│   ├─ 数据三维度：写什么（内容来源版权）/ 怎么写（标注规范）/ 怎么判（质量控制）
│   │   └─ 质量三板斧：交叉验证（一致率<80%=规范有问题）/ 专家抽检10-20% / 迭代更新
│   ├─ PM设计四层关注点：UX层（3步创建/实时Preview/撤销回滚）→ 能力层（Prompt面板/Flow Builder/插件市场）
│   │   → 平台层（OAuth·RBAC/多租户隔离/计费配额）→ 运维层（日志监控/QoS告警P0-P2）
│   ├─ 黄金测试集：50-100条起步；核心场景每类≥10条；每次改Prompt/换模型跑回归，通过率≥95%才推进
│   ├─ 上线检查清单P0：回归≥95% / P0人工验收 / 降级已部署 / 告警已测试 / 安全审核 / 协议更新
│   └─ 灰度发布 + 上线后关键72小时
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ⑤ 项目全','Prompt','灰度']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ⑥ PM四项核心技能（M13）】
├─ ⑥ PM四项核心技能（M13）
│   ├─ 需求分析：三问（真痛点/多少人/ROI）；RICE优先级；KANO分类（基本/期望/兴奋）；用户故事（作为X我想要Y以便Z）
│   ├─ 数据分析：北极星指标+AARRR；埋点三要素（事件名/属性/用户ID）+三原则；报告=结论先行
│   ├─ 项目管理：Scrum两周Sprint（Planning/站会/Review/Retro）；关键路径法；估时×1.5留buffer（AI项目+30-50%）
│   │   └─ AI特殊规则：PM算法每天同步效果 / Prompt改动必须版本管理 / 模型切换PM审批；KPT复盘（Keep/Problem/Try）
│   └─ 文档写作：PRD功能四要素（描述/输入输出/业务规则/异常处理）；坑=缺边界条件/需求方案混写/无优先级/改了不记录
│', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ⑥ PM四','Prompt','北极星']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【C-AI产品搭建思维导图 · ⑦ 实战链路：从模糊需求到 Dify Demo（Rolepl】
└─ ⑦ 实战链路：从模糊需求到 Dify Demo（Roleplay为例）
    需求收口（用户/场景/成功标准/不做清单）→ 翻成产品规则 → 翻成状态和判断（变量表）
    → Workflow主链路 → 规则vs模型分工（轻量/主模型）→ 先搭骨架再补丰富度 → 验收（最小测试集）', array['workflow','product']::text[], array['C-AI产品搭建思维导图 · ⑦ 实战链']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ① 演进五阶段（第1课）：AI Coding 的历史坐标】
├─ ① 演进五阶段（第1课）：AI Coding 的历史坐标
│   ├─ L1 对话问问题(2019 GPT-2) → L2 对话辅助开发(2021 Copilot / 2023 Cursor)
│   ├─ L3 Agent辅助开发(2024 Function Call / 2025 Claude Code)
│   ├─ L4 虚拟员工(2025 Manus / 2026 OpenClaw·Hermes) → L5 团队级完全开发(未来)
│   └─ 研发流程重塑：研发从写代码变成做技术决策；非研发也能用技术
│       └─ AI搞定细节后，全局思维和产品思维（开发什么）更突出
│', array['ai-tech']::text[], array['D-AI Coding思维导图 · ① ','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ② 工具地图（第2课）】
├─ ② 工具地图（第2课）
│   ├─ 模型选型：强模型规划 + 便宜模型执行；预算排序 opus>sonnet>GLM5>Kimi
│   ├─ 四类工具：零代码平台(lovable/妙搭，被平台绑定) / 开发Agent(CC/Codex/Cursor) /
│   │   智能编辑器(Cursor/Trae/CodeBuddy) / 数字员工(OpenClaw/Manus，实验性，安全风险)
│   └─ 数字员工运行位置：本地(危险) / 大厂托管(安全但慢) / 本地Docker容器(专业但安全方便)
│', array['ai-tech']::text[], array['D-AI Coding思维导图 · ② ','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ③ 应用是如何构建的（第3课）：全栈地基】
├─ ③ 应用是如何构建的（第3课）：全栈地基
│   ├─ 前后端分离：数据集中统一管理（唯一后端），前端无数个只管展示交互
│   ├─ 前端：HTML骨架/CSS样式/JS大脑；React=组件化+数据驱动（改数据≠改界面，框架翻译DOM）
│   │   └─ AI生成React准确率最高：训练数据多、模式统一可预测
│   ├─ 后端三组件：数据库（表+CRUD）/ API服务器（中枢：校验→逻辑→返回，前端永不直连数据库）/ 任务队列（异步外包）
│   ├─ AI友好全栈组合：Supabase(数据库+Auth+自动API+RLS) + Next.js(前端+轻量后端+文件路由) + Vercel(一键部署)
│   ├─ API vs SDK：API是规则（接口约定），SDK是帮你遵守规则的现成代码
│   ├─ Git三工作流：本地(add+commit快照) / 分支(branch+merge，频繁合并小commit) / 远端(push+pull)
│   │   └─ AI Coding分支管理：每功能一分支一Agent，做坏一键回滚；Git worktree多分支并行
│   ├─ 测试三层：单元(最小零件)→集成(数据流动)→E2E(模拟真实用户，资源有限优先保)
│   ├─ 部署：服务器/云平台/CDN；域名+DNS；CI/CD(GitHub Actions)；Vercel自动化；环境隔离(开发/测试/生产/灰度)
│   └─ 安全两大坑：密钥泄露（全放后端+环境变量，前端代码禁止）/ 数据越权（水平/垂直，数据库层RLS锁死，对用户端零信任）
│', array['ai-tech']::text[], array['D-AI Coding思维导图 · ③ ','Agent','灰度']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ④ 可靠开发·Harness工程（第4课，全文核心）】
├─ ④ 可靠开发·Harness工程（第4课，全文核心）
│   ├─ Harness五问题：状态持久性(context有限) / 目标一致性(长任务漂移) / 行动可验证性(自评不可靠) /
│   │   熵增抑制(冗余累积) / 人机边界(何时自主何时交人)
│   ├─ 公式：Agent效果 = 模型能力 + Harness质量
│   ├─ 工作环境管理：CLAUDE.md/agent.md = 知识外化第一步（隐性知识对AI等于不存在）；/init自动生成
│   ├─ Context Engineering：上下文是Agent最珍贵资源（CC 20万token）；快满时质量下降
│   │   ├─ 核心操作：/context查看 / /compact压缩 / /new重开（前提：commit+progress.md+CLAUDE.md都更新好）
│   │   └─ 避免浪费：不读整个大文件 / 一个会话不做不相关任务 / 大改拆分推进 / 不粘大段日志
│   ├─ 多会话记忆：把记忆从context搬到文件系统
│   │   ├─ 会话结束前：更新progress.md + git commit；会话开始：读CLAUDE.md和progress.md续航
│   │   └─ 双模式工作法：Initializer(搭骨架+FeatureList全标[ ]) + Coding(逐条做完标[x]commit)
│   │       └─ FeatureList把"完成"从主观感觉变成外部可验证的客观标准
│   ├─ 工具封装：Tools(内置) / MCP(U盘，有状态但重) / Skills(可复用流程资产，静态)
│   │   └─ 原则：不让模型直接调工具，让模型写代码调工具；过滤处理在执行环境内完成，只回传最终结果
│   └─ Agent编排五模式：链式(先后依赖) / 路由(按类型分发) / 并行(互不依赖) / 编排者-执行者 / 评估者-优化者(高质量输出)
│', array['ai-tech']::text[], array['D-AI Coding思维导图 · ④ ','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ⑤ 从 Vibe Coding 到 Spec Coding（】
├─ ⑤ 从 Vibe Coding 到 Spec Coding（第4-5课）
│   ├─ Vibe Coding：快但无法预测/维护/验收——适合快速验证假设、只要能演示
│   ├─ Spec Coding(SDD规范驱动)：AI写代码前把"要做什么"写清楚（功能/行为/数据模型/边界/验收标准）
│   ├─ 人机闭环七步：人拆需求(最小功能单元) → 人+AI细化Spec(/opsx:propose) → AI严格按Spec开发(/opsx:apply)
│   │   → AI对照验收标准自验 → 人验收(不符合先改Spec不改代码) → 版本管理(/opsx:archive+commit) → 平台自动部署
│   ├─ 工具对比：speckit(五步细拆specify→clarify→plan→tasks→implement，适合正式项目) vs
│   │   OpenSpec/opsx(propose做重+explore+sync，适合已有项目增量变更)
│   └─ 核心价值：把技术决策和需求定义在写代码之前锁死，防止"AI自己脑补需求"
│', array['ai-tech']::text[], array['D-AI Coding思维导图 · ⑤ ']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【D-AI Coding思维导图 · ⑥ 两类Agent的本质分界（第5课收尾）】
└─ ⑥ 两类Agent的本质分界（第5课收尾）
    ├─ Claude Code类：背后有完整操作系统（文件系统+命令执行）→ 持续存在、可自我迭代、自由度极高
    ├─ 项目内部Agent：无文件系统、瞬时存在（调用即结束）、无法自我迭代
    ├─ 推论：项目Agent接不了Skill（Skill本质=读目录里的MD文件，没文件系统就读不了）
    └─ 补偿：工具类型MCP可部分弥补，但瞬时性、无自迭代的本质局限仍在', array['ai-tech']::text[], array['D-AI Coding思维导图 · ⑥ ','Agent','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent专项思维导图 · ① 是什么（概念层：控制权的四种分配）】
├─ ① 是什么（概念层：控制权的四种分配）
│   ├─ 控制权四档：Chatbot(用户全程) → Copilot(用户操作+AI建议) → Agent(部分移交) → Workflow(设计者定义)
│   │   └─ 建筑类比：顾问 → 副驾驶 → 项目经理 → 工厂流水线
│   ├─ Agent = LLM(推理) + 工具(行动) + 记忆(持久化) + 上下文系统(环境输入)
│   ├─ Agent Loop：不是管线是循环——"接任务→想→做→看结果→继续想"
│   │   └─ PM要看：有没有终止条件 / 权限是否结构化 / 失败结果是否进入下一轮
│   └─ Loop三阶段：Init(收集上下文) → Loop(buildMessages→streamAPI→runTools→回填) → Shutdown(清理保存)
│       └─ 好产品 = 内循环高效自转 + 外循环少打断用户
│', array['ai-tech']::text[], array['Agent专项思维导图 · ① 是什么（','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent专项思维导图 · ② 看谁的（五大产品范式：控制权放在五个不同位置）】
├─ ② 看谁的（五大产品范式：控制权放在五个不同位置）
│   ├─ Claude Code · 终端Agent → 控制权=本地授权+事件流（体验优先，唯一有持久memory：CLAUDE.md+memory文件）
│   ├─ Codex · 协议Runtime → 控制权=turn/session协议审计（可治理，session用完即弃）
│   ├─ DeepAgents · 框架Harness → 控制权=middleware组合顺序（组合优先，顺序即能力）
│   ├─ OpenClaw · 网关平台 → 控制权=多层policy（生态优先，插件只走public SDK）
│   ├─ Hermes · 学习Agent → 控制权=curator经验筛选（学习优先，经验不直接喂给下一次）
│   └─ 选型答案：自己干活→CC / 企业审计→Codex / 搭系统→DeepAgents / 多渠道→OpenClaw / 长期陪伴→Hermes
│       └─ 落脚判断：选范式比选模型重要——模型可以换，范式换了等于重写
│', array['ai-tech']::text[], array['Agent专项思维导图 · ② 看谁的（','Agent']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent专项思维导图 · ③ 怎么建（四大核心模块）】
├─ ③ 怎么建（四大核心模块）
│   ├─ 工具系统：三层必须分开设计
│   │   ├─ 发现层(注册) / 可见层(本轮投影给模型) / 执行层(沙箱+harness)
│   │   ├─ Codex: registry 30个 ≠ 本轮specs 5个（存在≠可见）
│   │   └─ 分级：高频→Tool内置 / 中频→Skill按需 / 低频→MCP动态挂载（单Agent≤15个skill）
│   ├─ 记忆与上下文
│   │   ├─ Compact三档：75% autoCompact(自动保关键) → 90% reactiveCompact(激进防溢出) → 95% contextCollapse(只留核心)
│   │   │   └─ 每档只是拉回安全区，长任务可能三档依次经历
│   │   ├─ Tombstone：压缩留标记，让Agent"知道自己忘了"→ 不确定时回头确认（不是崩溃回滚！）
│   │   └─ Dream三控制门(Hermes)：relevance相关性 / frequency访问频率 / recency时间衰减 → 记忆会老化
│   ├─ 权限安全：权限是结构化事件，不是UI弹窗
│   │   ├─ 弹窗三断裂：SDK没弹窗能力 / 远程弹本地没意义 / 审计只有"点了允许"
│   │   ├─ 四档：Plan(写工具代码层禁用) / Default(逐次确认) / Auto(分类器审批) / Trusted(显式授权)
│   │   ├─ BashTool六层：AST解析→精确匹配→前缀通配→语义分析→路径约束→ML分类器
│   │   └─ fail-safe：判断不了默认拒绝；每次拒绝记录 tool name + id + input + denial reason
│   └─ 多Agent编排：隔离质量 > 并发数量
│       ├─ 反模式：子Agent共享父全部上下文 → 干扰推理/执行隐含不安全指令/结果不可控
│       ├─ 正确(DeepAgents)：排除父的messages/todos/skills/memory，只给任务描述+必要工具
│       ├─ continue vs spawn：独立性高/需隔离/可并行 → spawn；依赖前文/串行 → continue
│       └─ 生命周期结构化API：start→check→update→cancel→list（不是轮询Prompt问"做完没"）
│', array['ai-tech']::text[], array['Agent专项思维导图 · ③ 怎么建（','Agent','Prompt','MCP']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent专项思维导图 · ④ 护城河（Harness工程：为什么模型可买、Harnes】
├─ ④ 护城河（Harness工程：为什么模型可买、Harness要自建）
│   ├─ 类比：LLM是大脑，Harness是骨架（施工管理体系是建筑公司的壁垒）
│   ├─ CC三支柱：QueryEngine(状态容器+主循环) / Permission Bridge(权限语义延伸) / Message Adapter(消息格式统一)
│   ├─ 为什么不趋同：Harness取决于工程积累+设计取舍+迭代深度——买不来
│   ├─ 8条硬标准（前3条是地基）：①主循环 ②状态容器 ③工具存在/可见分离 ④权限结构化事件
│   │   ⑤上下文真源层级 ⑥compact/resume ⑦失败可复盘 ⑧扩展有边界
│   └─ 4反模式：都上Agent / 全塞Prompt / 听模型说完了(权限只做弹窗) / 只存不看(memory不筛选)
│', array['ai-tech']::text[], array['Agent专项思维导图 · ④ 护城河（','Agent','Prompt']::text[]);
insert into course_chunks (content, dimension_tags, keywords) values ('【Agent专项思维导图 · ⑤ 怎么落地（产品决策）】
└─ ⑤ 怎么落地（产品决策）
    ├─ 该不该用·决策三问：①步骤能预定吗(能→Workflow) ②要AI自主判断吗(不要→Copilot) ③失败代价能承受吗(不能→加限制/降级)
    ├─ 设计决策树6步：形态★最重要→安全模型→上下文策略→工具生态→扩展性(Hook)→学习能力
    │   └─ 关键交叉：形态决定安全→影响上下文→约束工具暴露；选错形态参考对象，做再好也是错的
    ├─ 4个工程问题：任务边界(Loop≤50行) / 工具契约(可见≠实际) / 编排状态(隔离+生命周期) / 评测闭环(6种失败场景)
    ├─ 能力扩展选型：RAG开卷考试 / 微调拜师学艺(2000条门槛) / Prompt听话(五要素)
    │   └─ 选型两问：知识更新频率 + 输出定制化程度（规范每年更新做微调=典型反例，该用RAG）
    ├─ 场景判断三例：审图→Workflow控制下的Agent+人工复核 / 代码补全→Copilot / 知识问答→RAG+Chatbot
    └─ PM必查5条：①Loop有终止条件吗 ②工具分层了吗 ③长任务有压缩/恢复吗 ④权限是结构化事件吗 ⑤失败能复盘吗', array['ai-tech']::text[], array['Agent专项思维导图 · ⑤ 怎么落地','RAG','Agent','Prompt','微调','评测']::text[]);
commit;
