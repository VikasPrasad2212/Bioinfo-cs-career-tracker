import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to get GoogleGenAI instance safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint for AI-powered Skill Gap Analysis and Personalized Roadmap
app.post("/api/gemini/skill-gap-analysis", async (req, res) => {
  try {
    const { 
      resumeText, 
      targetRole = "Computational Genomics & NGS Pipeline Engineer",
      matchedKeywords = [],
      missingKeywords = [],
      educationLevel = "B.Tech Computer Science & Engineering"
    } = req.body;

    if (!resumeText || typeof resumeText !== "string") {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return a high-quality fallback roadmap if API key is not configured in local development
      const fallbackResult = generateDeterministicRoadmap(resumeText, targetRole, matchedKeywords, missingKeywords);
      return res.json({ result: fallbackResult, isFallback: true });
    }

    const systemPrompt = `You are a Principal Computational Biologist and Hiring Committee Chair for top Indian research labs (CSIR-IGIB, CSIR-CCMB, NCBS, IIIT-H CCNSB) and biotech enterprises (Strand Life Sciences, MedGenome, Bugworks). 
Your specialty is evaluating Computer Science engineers and freshers who want to transition into bioinformatics, genomic data science, statistical genomics (R/Bioconductor), and AI drug discovery.
Analyze the candidate's resume/CV snippet against the target bioinformatics role and return a structured JSON response.

Emphasize:
1. Translating standard CS skills (Python, R language, Algorithms, Linux, Docker, PyTorch, C++, SQL, Git) into their biological research equivalents.
2. If the candidate knows or is learning R language, specifically leverage R, Bioconductor, DESeq2, edgeR, Seurat, GenomicRanges, and ggplot2 for statistical genomics and transcriptomics.
3. Identifying realistic skill gaps (e.g. Nextflow, Biopython/Bioconductor, BAM/VCF file parsing, GATK best practices, single-cell AnnData/Scanpy/Seurat, AlphaFold/PDB structure handling).
4. Providing an actionable 4-phase learning roadmap with real-world open-access datasets (NCBI SRA, 1000 Genomes, GEO, PDB, AlphaFold DB) and concrete GitHub project deliverables that impress PIs and hiring managers.
5. Specifying technical interview questions with tips on how a CS candidate can leverage software engineering, statistical intuition, and algorithmic problem-solving.`;

    const userPrompt = `Evaluate this Computer Science candidate for the bioinformatics specialization: "${targetRole}".

Candidate Education/Background: ${educationLevel}
Detected Keywords: ${matchedKeywords.join(", ") || "None specified"}
Missing Core Keywords: ${missingKeywords.join(", ") || "None specified"}

Candidate Resume / Profile Text:
"""
${resumeText.slice(0, 3500)}
"""

Generate a complete, rigorous, and personalized skill gap analysis and step-by-step 4-phase learning roadmap for this candidate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallFitScore: {
              type: Type.NUMBER,
              description: "Overall fit score from 0 to 100 based on CS foundations and current bioinformatics readiness."
            },
            readinessLevel: {
              type: Type.STRING,
              description: "Readiness classification (e.g. 'High-Potential CS Transitioner', 'Foundational Pipeline Builder', 'AI/ML Bio-Specialist')"
            },
            targetRole: {
              type: Type.STRING,
              description: "The evaluated target role"
            },
            executiveSummary: {
              type: Type.STRING,
              description: "2-3 paragraphs analyzing their CS strengths, biological learning curve, and tactical transition strategy."
            },
            strengthsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of strong transferable CS skills found in their resume with their bio application."
            },
            criticalGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING, description: "'Critical' | 'Recommended' | 'Bonus'" },
                  whyItMatters: { type: Type.STRING },
                  estimatedTimeToMaster: { type: Type.STRING },
                  csAnalog: { type: Type.STRING, description: "Corresponding CS concept to make it easy to grasp" }
                },
                required: ["skill", "category", "whyItMatters", "estimatedTimeToMaster"]
              },
              description: "List of 4-6 specific skill gaps"
            },
            personalizedRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  phaseName: { type: Type.STRING },
                  durationWeeks: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  topicsToLearn: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedToolsAndLibraries: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  actionableMiniProject: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      suggestedDataset: { type: Type.STRING },
                      githubDeliverable: { type: Type.STRING }
                    },
                    required: ["title", "description", "suggestedDataset", "githubDeliverable"]
                  },
                  recommendedFreeResources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING },
                        urlDescription: { type: Type.STRING }
                      },
                      required: ["title", "type", "urlDescription"]
                    }
                  }
                },
                required: ["phaseNumber", "phaseName", "durationWeeks", "goal", "topicsToLearn", "recommendedToolsAndLibraries", "actionableMiniProject", "recommendedFreeResources"]
              },
              description: "4 structured phases of learning"
            },
            interviewQuestionsToExpect: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  conceptTested: { type: Type.STRING },
                  tipForCSStudent: { type: Type.STRING }
                },
                required: ["question", "conceptTested", "tipForCSStudent"]
              },
              description: "3-4 real interview questions asked by Indian labs/companies"
            },
            topMatchingRolesInIndia: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  roleTitle: { type: Type.STRING },
                  exampleOrganizations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  whyGoodFit: { type: Type.STRING }
                },
                required: ["roleTitle", "exampleOrganizations", "whyGoodFit"]
              },
              description: "3 top matching opportunities in India"
            }
          },
          required: [
            "overallFitScore",
            "readinessLevel",
            "targetRole",
            "executiveSummary",
            "strengthsIdentified",
            "criticalGaps",
            "personalizedRoadmap",
            "interviewQuestionsToExpect",
            "topMatchingRolesInIndia"
          ]
        }
      }
    });

    const rawText = response.text || "{}";
    const parsedData = JSON.parse(rawText);
    parsedData.generatedAt = new Date().toISOString();

    return res.json({ result: parsedData, isFallback: false });
  } catch (error: any) {
    console.error("Error in skill-gap-analysis:", error);
    // Return structured fallback on error
    const fallbackResult = generateDeterministicRoadmap(
      req.body.resumeText || "", 
      req.body.targetRole || "Computational Genomics & NGS Pipeline Engineer",
      req.body.matchedKeywords || [],
      req.body.missingKeywords || []
    );
    return res.json({ 
      result: fallbackResult, 
      isFallback: true, 
      errorMessage: error.message || "An error occurred with the Gemini API." 
    });
  }
});

// Fallback generator for when offline or no API key
function generateDeterministicRoadmap(
  resumeText: string,
  targetRole: string,
  matchedKeywords: string[],
  missingKeywords: string[]
) {
  const isPython = /python/i.test(resumeText);
  const isR = /\br\b|r programming|bioconductor|deseq2|seurat|ggplot2|tidyverse/i.test(resumeText);
  const isML = /machine learning|pytorch|tensorflow|scikit-learn/i.test(resumeText);
  const isCpp = /c\+\+|cpp|c programming/i.test(resumeText);

  return {
    overallFitScore: Math.min(94, Math.max(48, (matchedKeywords.length * 4) + (isPython ? 20 : 5) + (isR ? 22 : 5) + (isML ? 18 : 5) + (isCpp ? 15 : 5))),
    readinessLevel: isR && isPython ? "Dual-Language Bio-Data Scientist (Python + R)" : isR ? "High-Potential Statistical Genomicist (R/Bioconductor)" : isML ? "High-Potential AI/ML Bio-Specialist" : isCpp ? "High-Performance Systems Bio-Engineer" : "High-Potential CS Transitioner",
    targetRole,
    executiveSummary: `Your strong Computer Science foundation in ${isR ? 'R statistical programming, Bioconductor data structures, and ' : ''}${isPython ? 'Python automated scripting' : isCpp ? 'low-level systems and high-throughput execution' : 'software engineering and algorithmic problem-solving'} provides an immediate advantage in modern computational biology. In premier research institutes like CSIR-IGIB, NCBS, CSIR-CCMB, and Strand Life Sciences, R is the de facto standard for differential gene expression (DESeq2), single-cell transcriptomics (Seurat), and statistical modeling, while Python powers machine learning and data pipelines. By pairing R statistical mastery with workflow orchestrators (Nextflow/Snakemake) and NGS file parsing (.BAM, .VCF), you will be an exceptionally competitive candidate for top Indian research trainee and fellow roles.`,
    strengthsIdentified: [
      isR ? "R & Bioconductor: Industry standard for transcriptomics (DESeq2, edgeR), S4 GenomicRanges, and publication-ready ggplot2 visual analysis" : "Statistical Computing Potential: Fast ramp-up to R and statistical hypothesis testing",
      isPython ? "Python & Scripting: Core language used for Biopython, pandas genomic matrices, and workflow scripts" : "Programming Fundamentals: Rapid syntax translation to Python/Bash",
      isML ? "Deep Learning & Matrix Math: Direct transferability to AlphaFold structure embeddings and Graph Neural Networks" : "Algorithmic Rigor: Foundation in dynamic programming (Smith-Waterman) and graph traversals",
      "Linux / Command-Line: Essential for managing High-Performance Computing (HPC) and Slurm job clusters in research labs",
      "Data Structures: Direct conceptual bridge to k-mer hashing, suffix trees, and Burrows-Wheeler Transform"
    ],
    criticalGaps: [
      {
        skill: "Nextflow / Snakemake Workflow Management",
        category: "Critical" as const,
        whyItMatters: "Standard framework used in production genomics pipelines to coordinate multi-stage Docker containers and HPC Slurm jobs.",
        estimatedTimeToMaster: "1 - 2 weeks",
        csAnalog: "DAG workflow orchestrators like Apache Airflow or Prefect"
      },
      {
        skill: "Biological File Formats (.FASTQ, .BAM, .VCF, .FASTA)",
        category: "Critical" as const,
        whyItMatters: "Every bioinformatician must manipulate raw sequencer reads, coordinate alignments, and variant calls using Samtools and Bcftools.",
        estimatedTimeToMaster: "3 - 5 days",
        csAnalog: "Tab-delimited, compressed columnar data formats & binary indices"
      },
      {
        skill: isR ? "Bioconductor SummarizedExperiment & Single-Cell Seurat" : "Biopython & Scanpy Library Ecosystem",
        category: "Recommended" as const,
        whyItMatters: isR ? "Standard R data containers for housing gene count matrices alongside sample clinical metadata and genomic coordinates." : "Standard Python packages for parsing sequence records and analyzing gene expression matrices.",
        estimatedTimeToMaster: "1 week",
        csAnalog: "Object-oriented multi-modal matrix containers"
      },
      {
        skill: "GATK (Genome Analysis Toolkit) Best Practices",
        category: "Recommended" as const,
        whyItMatters: "The gold standard pipeline for calling germline and somatic genetic variants from DNA-seq data.",
        estimatedTimeToMaster: "2 weeks",
        csAnalog: "Multi-stage data ETL and statistical outlier filtering"
      }
    ],
    personalizedRoadmap: [
      {
        phaseNumber: 1,
        phaseName: "Biological Data Representation & R/Python Sequence Foundations",
        durationWeeks: "Weeks 1 - 2",
        goal: "Master raw sequence manipulation, FASTA/FASTQ parsing, and R/Bioconductor statistical data structures.",
        topicsToLearn: [
          "Central Dogma of Molecular Biology: DNA -> RNA -> Protein translation mechanics",
          "Parsing FASTA/FASTQ files using Biostrings/Biopython with quality score filtering",
          "R Bioconductor fundamentals: GRanges, IRanges, and Biostrings sequence operations",
          "Pairwise sequence alignment algorithms (Needleman-Wunsch & Smith-Waterman dynamic programming)"
        ],
        recommendedToolsAndLibraries: ["R 4.3+", "Bioconductor", "Biostrings", "Python 3.11+", "RStudio / VS Code"],
        actionableMiniProject: {
          title: "FASTA Quality & GC-Content Analyzer in R & Python",
          description: "Build an R package or dual R/Python CLI that parses multi-megabyte sequence files, computes rolling GC-skew windows, and plots statistical quality distributions using ggplot2.",
          suggestedDataset: "NCBI SRA Public Dataset (e.g. SARS-CoV-2 or E. coli isolates)",
          githubDeliverable: "GitHub repo with R Markdown / Shiny report or Python CLI with automated unit tests."
        },
        recommendedFreeResources: [
          { title: "Bioconductor Official Courses & Vignettes", type: "Tutorial Portal", urlDescription: "Core packages for high-throughput biological data analysis in R" },
          { title: "Rosalind.info Bioinformatics Tree", type: "Interactive Coding Platform", urlDescription: "Solve 20+ algorithmic biology problems using R or Python" }
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "NGS Alignment, Samtools & Containerized Workflows",
        durationWeeks: "Weeks 3 - 4",
        goal: "Build reproducible Nextflow pipelines that align sequencing reads against reference genomes using Docker.",
        topicsToLearn: [
          "Burrows-Wheeler Transform (BWT) & FM-Index for rapid string indexing in BWA-MEM2 / Minimap2",
          "SAM/BAM alignment flags, CIGAR strings, and indexing via Samtools and Rsamtools",
          "Nextflow DSL2 syntax: Processes, Channels, Workflows, and Singularity/Docker profiles",
          "Genetic variant calling mechanics: VCF file format structure and Bcftools / VariantAnnotation filtering"
        ],
        recommendedToolsAndLibraries: ["Nextflow", "Docker", "BWA-MEM", "Samtools", "Bcftools", "Rsamtools"],
        actionableMiniProject: {
          title: "Automated End-to-End Variant Calling Pipeline in Nextflow",
          description: "Develop a containerized Nextflow pipeline that accepts raw FASTQ files, runs FastQC, aligns against Human Chromosome 20 (GRCh38), and outputs filtered VCF mutation tables.",
          suggestedDataset: "1000 Genomes Project (NA12878 / HG001 benchmark sample)",
          githubDeliverable: "Nextflow DSL2 pipeline repository with `nextflow.config`, sample test data, and automated GitHub Actions CI."
        },
        recommendedFreeResources: [
          { title: "nf-core/rnaseq & training tutorials", type: "Community Standards", urlDescription: "Industry standard Nextflow pipelines and training materials" },
          { title: "GATK Best Practices Workflows", type: "Broad Institute Guide", urlDescription: "Standard operating procedures for germline and somatic discovery" }
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Transcriptomics with R (DESeq2) & Single-Cell Analysis (Seurat)",
        durationWeeks: "Weeks 5 - 6",
        goal: "Perform differential gene expression, statistical hypothesis testing, and single-cell RNA-seq clustering in R.",
        topicsToLearn: [
          "DESeq2 & edgeR: Negative Binomial distribution modeling, size factor normalization, and Wald test",
          "Generating publication-grade Volcano plots, PCA plots, and ComplexHeatmaps with ggplot2",
          "Single-cell analysis in R using Seurat: FindVariableFeatures, RunPCA, FindNeighbors, and RunUMAP",
          "Gene Ontology (GO) and KEGG pathway enrichment analysis using clusterProfiler in R"
        ],
        recommendedToolsAndLibraries: ["R", "DESeq2", "Seurat", "ggplot2", "ComplexHeatmap", "clusterProfiler"],
        actionableMiniProject: {
          title: "End-to-End RNA-seq Differential Expression & Volcano Report in R",
          description: "Download a public cancer RNA-seq count dataset (e.g. TCGA or GEO), run DESeq2 differential analysis, identify top 50 biomarkers, and generate an interactive R Shiny / HTML report.",
          suggestedDataset: "NCBI GEO Dataset (e.g. GSE45827 or TCGA-BRCA count matrix)",
          githubDeliverable: "Fully reproducible R Markdown report or Shiny app deployed with Docker and published on GitHub."
        },
        recommendedFreeResources: [
          { title: "RNA-seq Analysis with DESeq2 (Harvard Chan)", type: "Open Curriculum", urlDescription: "Comprehensive training module on statistical modeling of count data" },
          { title: "Seurat Single-Cell Tutorials (Satija Lab)", type: "Official Guide", urlDescription: "Step-by-step guided clustering of 2,700 human PBMCs" }
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Research Outreach, Cold Emailing & Interview Execution",
        durationWeeks: "Weeks 7 - 8",
        goal: "Showcase computational biology and R/Bioconductor portfolio to top Indian PIs and pass technical interviews.",
        topicsToLearn: [
          "Drafting lab-specific Statements of Purpose highlighting CS software craftsmanship and R statistical skills",
          "Answering standard bioinformatics interview questions (p-value adjustment/FDR, DESeq2 dispersion shrinkage, BAM flags)",
          "Demonstrating reproducible computational pipelines during screen calls via live GitHub repos"
        ],
        recommendedToolsAndLibraries: ["BioInfoCS Cold Email Generator", "GitHub Pages", "R Markdown / Quarto", "Zotero"],
        actionableMiniProject: {
          title: "Public Bioinformatics & R Statistics Engineering Portfolio Site",
          description: "Package your 3 pipeline repositories into a clean GitHub portfolio with live interactive demos (e.g. Shiny, Streamlit) and clean documentation ready to email to CSIR/IISc professors.",
          suggestedDataset: "All previous project outputs",
          githubDeliverable: "Live GitHub portfolio with linked code repositories and benchmarks."
        },
        recommendedFreeResources: [
          { title: "Bioinformatics Career Hub India", type: "Portal", urlDescription: "Curated application portals for CSIR-IGIB, CCMB, Strand, and MedGenome" }
        ]
      }
    ],
    interviewQuestionsToExpect: [
      {
        question: "Why do we use the Negative Binomial distribution instead of Poisson for RNA-seq differential expression in DESeq2/EdgeR?",
        conceptTested: "Biological variance & overdispersion in high-throughput sequencing",
        tipForCSStudent: "Explain that in RNA-seq count data, biological variance between replicates causes overdispersion (variance exceeds the mean), which violates Poisson's mean=variance assumption. Negative Binomial introduces a dispersion parameter to account for this."
      },
      {
        question: "What is False Discovery Rate (FDR) and why is Benjamini-Hochberg correction essential when testing 20,000 genes?",
        conceptTested: "Multiple hypothesis testing & statistical rigor",
        tipForCSStudent: "Mention that testing 20,000 genes at standard p < 0.05 would yield ~1,000 false positives purely by chance. Benjamini-Hochberg controls the expected proportion of false discoveries among rejected null hypotheses."
      },
      {
        question: "How does the Burrows-Wheeler Transform (BWT) enable aligning millions of sequencing reads in seconds?",
        conceptTested: "String search algorithms & suffix array compression",
        tipForCSStudent: "Explain BWT as a reversible permutation of a string that clusters identical characters, combined with an FM-index to achieve O(m) pattern lookup time independent of genome length."
      }
    ],
    topMatchingRolesInIndia: [
      {
        roleTitle: "Statistical Genomics & Transcriptomics Project Trainee",
        exampleOrganizations: ["CSIR-CCMB (Hyderabad)", "NCBS & InStem (Bengaluru)", "ACTREC (Mumbai)"],
        whyGoodFit: "High demand for students combining CS programming skills with R/Bioconductor and DESeq2 differential expression pipelines."
      },
      {
        roleTitle: "Project Trainee / Junior Bio-Pipeline Engineer",
        exampleOrganizations: ["CSIR-IGIB (New Delhi)", "NCBS (Bengaluru)", "CSIR-CCMB (Hyderabad)"],
        whyGoodFit: "Strong demand for CS engineers to automate NGS data pipelines and maintain Linux computing clusters."
      },
      {
        roleTitle: "Genomic Data Software Engineer Trainee",
        exampleOrganizations: ["Strand Life Sciences", "MedGenome Labs", "Elucidata"],
        whyGoodFit: "Healthcare diagnostics companies need fast Python/R/C++ code to interpret clinical variant databases and deploy cloud pipelines."
      }
    ],
    generatedAt: new Date().toISOString()
  };
}

// Endpoint for AI-powered Mock Interview - Start Session
app.post("/api/gemini/interview/start", async (req, res) => {
  try {
    const {
      targetRole = "Computational Genomics & NGS Pipeline Engineer",
      targetLab = "CSIR-IGIB (New Delhi) - Genomics & Variant Calling Lab",
      difficulty = "Fresher / Project Trainee",
      resumeSnippet = "",
      candidateBackground = "B.Tech Computer Science & Engineering",
      totalQuestions = 4
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackStart = generateDeterministicInterviewStart(targetRole, targetLab, difficulty, resumeSnippet);
      return res.json({ result: fallbackStart, isFallback: true });
    }

    const systemPrompt = `You are a distinguished Senior Principal Investigator and Faculty Hiring Chair at a premier Indian research institution (${targetLab}).
You are conducting a technical interview for a candidate with a Computer Science engineering background (${candidateBackground}) applying for the role: "${targetRole}" at difficulty level "${difficulty}".

Your goal is to test both:
1. Core Computer Science intuition (Algorithms, Data Structures, Distributed Computing, C++/Python/R, Linux, Cloud/Containers)
2. How well they bridge CS concepts to biological data (FASTA/FASTQ, BAM/VCF, Dynamic Programming alignments, DESeq2 statistics, single-cell matrices, AlphaFold/GNNs).

Generate:
1. Your interviewer persona (Name, Title, Organization in India).
2. A warm but rigorous opening question (Question 1 of ${totalQuestions}) that challenges their CS transition into this specific lab's domain.
3. Categorize the question, identify the exact concept being tested, and provide a helpful hint specifically for a CS student.`;

    const userPrompt = `Lab / Organization: ${targetLab}
Target Role: ${targetRole}
Difficulty Level: ${difficulty}
Candidate Background: ${candidateBackground}
Candidate Resume Snippet:
${resumeSnippet || "Candidate has strong Python, Linux, Data Structures, Algorithms, and basic R foundations."}

Generate the interviewer persona and the first interview question.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPersona: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                organization: { type: Type.STRING }
              },
              required: ["name", "title", "organization"]
            },
            openingRemarks: { type: Type.STRING, description: "A realistic 1-2 sentence opening greeting from the PI" },
            firstQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                category: { 
                  type: Type.STRING,
                  enum: [
                    "Algorithms & String Search",
                    "NGS Pipelines & HPC",
                    "R / Statistical Genomics",
                    "AI & Structural Biology",
                    "Databases & Cloud Genomics",
                    "General CS-to-Bio Motivation"
                  ]
                },
                conceptTested: { type: Type.STRING },
                hintForCS: { type: Type.STRING }
              },
              required: ["question", "category", "conceptTested", "hintForCS"]
            }
          },
          required: ["interviewerPersona", "openingRemarks", "firstQuestion"]
        }
      }
    });

    const raw = response.text || "{}";
    const parsed = JSON.parse(raw);
    const sessionId = `interview-${Date.now()}`;

    return res.json({
      result: {
        sessionId,
        interviewerPersona: parsed.interviewerPersona,
        openingRemarks: parsed.openingRemarks,
        totalQuestions,
        firstQuestion: {
          id: `q-1`,
          questionNumber: 1,
          question: parsed.firstQuestion.question,
          category: parsed.firstQuestion.category,
          conceptTested: parsed.firstQuestion.conceptTested,
          hintForCS: parsed.firstQuestion.hintForCS,
          timestamp: new Date().toISOString()
        }
      },
      isFallback: false
    });
  } catch (error: any) {
    console.error("Error in interview start:", error);
    const fallbackStart = generateDeterministicInterviewStart(
      req.body.targetRole || "Computational Genomics & NGS Pipeline Engineer",
      req.body.targetLab || "CSIR-IGIB (New Delhi)",
      req.body.difficulty || "Fresher / Project Trainee",
      req.body.resumeSnippet || ""
    );
    return res.json({ result: fallbackStart, isFallback: true, error: error.message });
  }
});

// Endpoint for AI-powered Mock Interview - Evaluate Answer and Get Next Question
app.post("/api/gemini/interview/evaluate-and-next", async (req, res) => {
  try {
    const {
      targetRole = "Computational Genomics & NGS Pipeline Engineer",
      targetLab = "CSIR-IGIB (New Delhi)",
      difficulty = "Fresher / Project Trainee",
      questionNumber = 1,
      totalQuestions = 4,
      question = "",
      conceptTested = "",
      category = "Algorithms & String Search",
      userAnswer = "",
      previousTurns = []
    } = req.body;

    if (!userAnswer || typeof userAnswer !== "string") {
      return res.status(400).json({ error: "userAnswer is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackEval = generateDeterministicEvaluation(
        questionNumber,
        totalQuestions,
        question,
        category,
        userAnswer,
        targetRole,
        targetLab
      );
      return res.json({ result: fallbackEval, isFallback: true });
    }

    const isLast = questionNumber >= totalQuestions;

    const systemPrompt = `You are the Principal Investigator at ${targetLab} interviewing a CS engineer for "${targetRole}".
You must evaluate their answer with academic rigor and constructive mentorship, grading on a 1-10 scale.

Evaluate:
1. Technical accuracy (CS algorithmic rigor + Biological context).
2. "csTranslationWin": Highlight where the candidate smartly leveraged CS intuition (e.g. hash tables, dynamic programming, time/space complexity, multithreading, vectorized matrices).
3. "blindspotsOrMistakes": Point out any biological misconceptions, missed edge cases, or lack of domain precision.
4. "idealModelAnswer": Provide a crisp, 2-3 sentence gold-standard response that would get 10/10 in a top lab interview.
${!isLast ? `5. "nextQuestion": Generate Question ${questionNumber + 1} of ${totalQuestions}. The question should logically deepen the interview (e.g., if Q1 was algorithms, Q2 could be NGS file formats or Nextflow pipelines; or if Q1 was R differential expression, Q2 could be multiple testing corrections or single-cell clustering).` : ""}`;

    const userPrompt = `Current Question (${questionNumber}/${totalQuestions}):
"${question}"
Concept Tested: ${conceptTested}
Category: ${category}

Candidate's Answer:
"${userAnswer}"

Previous Turns Context:
${JSON.stringify(previousTurns.map((t: any) => ({ q: t.question, ans: t.userAnswer })))}

Target Role: ${targetRole}
Target Lab: ${targetLab}
Difficulty: ${difficulty}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: "Rating from 1 to 10" },
                verdict: { type: Type.STRING, description: "Short 3-6 word verdict header (e.g. 'Strong Algorithmic Grasp', 'Good CS Intuition, Needs Biological Precision')" },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2-3 specific positives in the candidate's answer"
                },
                csTranslationWin: { type: Type.STRING, description: "Highlight of effective CS concept mapping" },
                blindspotsOrMistakes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "1-2 areas to correct or biological nuances missed"
                },
                idealModelAnswer: { type: Type.STRING, description: "Gold-standard model answer" }
              },
              required: ["score", "verdict", "strengths", "csTranslationWin", "blindspotsOrMistakes", "idealModelAnswer"]
            },
            ...(!isLast ? {
              nextQuestion: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: [
                      "Algorithms & String Search",
                      "NGS Pipelines & HPC",
                      "R / Statistical Genomics",
                      "AI & Structural Biology",
                      "Databases & Cloud Genomics",
                      "General CS-to-Bio Motivation"
                    ]
                  },
                  conceptTested: { type: Type.STRING },
                  hintForCS: { type: Type.STRING }
                },
                required: ["question", "category", "conceptTested", "hintForCS"]
              }
            } : {})
          },
          required: isLast ? ["feedback"] : ["feedback", "nextQuestion"]
        }
      }
    });

    const raw = response.text || "{}";
    const parsed = JSON.parse(raw);

    return res.json({
      result: {
        feedback: parsed.feedback,
        isLastQuestion: isLast,
        nextQuestion: !isLast ? {
          id: `q-${questionNumber + 1}`,
          questionNumber: questionNumber + 1,
          question: parsed.nextQuestion.question,
          category: parsed.nextQuestion.category,
          conceptTested: parsed.nextQuestion.conceptTested,
          hintForCS: parsed.nextQuestion.hintForCS,
          timestamp: new Date().toISOString()
        } : null
      },
      isFallback: false
    });
  } catch (error: any) {
    console.error("Error in interview evaluate:", error);
    const fallbackEval = generateDeterministicEvaluation(
      req.body.questionNumber || 1,
      req.body.totalQuestions || 4,
      req.body.question || "",
      req.body.category || "Algorithms & String Search",
      req.body.userAnswer || "",
      req.body.targetRole || "Computational Genomics & NGS Pipeline Engineer",
      req.body.targetLab || "CSIR-IGIB"
    );
    return res.json({ result: fallbackEval, isFallback: true, error: error.message });
  }
});

// Endpoint for AI-powered Mock Interview - Final Performance Report Card
app.post("/api/gemini/interview/generate-report", async (req, res) => {
  try {
    const {
      targetRole = "Computational Genomics & NGS Pipeline Engineer",
      targetLab = "CSIR-IGIB (New Delhi)",
      difficulty = "Fresher / Project Trainee",
      turns = []
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackReport = generateDeterministicReport(turns, targetRole, targetLab, difficulty);
      return res.json({ result: fallbackReport, isFallback: true });
    }

    const systemPrompt = `You are the Hiring Committee at ${targetLab}.
Review the complete transcript of the candidate's technical interview for "${targetRole}" (${difficulty}) and generate a final evaluation report.

Calculate:
1. overallScore (1-100)
2. hiringDecision ('Strong Hire / Project Fellow' | 'Hire / High Potential Trainee' | 'Promising with Minor Gaps' | 'Needs More Preparation')
3. algorithmicIntuitionScore (1-100)
4. biologicalDomainAccuracyScore (1-100)
5. csTranslationScore (1-100)
6. interviewerSummary (2-3 concise sentences summarizing their candidacy)
7. topStrengthsObserved (3 bullets)
8. priorityImprovementAreas (3 bullets)
9. recommendedLabMatches (3 Indian research institutions / biotech labs where candidate is strongest)
10. recommendedNextSteps (3 practical steps before real interviews)`;

    const userPrompt = `Interview Transcript:
${JSON.stringify(turns, null, 2)}

Target Role: ${targetRole}
Target Lab: ${targetLab}
Difficulty Level: ${difficulty}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            hiringDecision: {
              type: Type.STRING,
              enum: [
                "Strong Hire / Project Fellow",
                "Hire / High Potential Trainee",
                "Promising with Minor Gaps",
                "Needs More Preparation"
              ]
            },
            interviewerSummary: { type: Type.STRING },
            algorithmicIntuitionScore: { type: Type.INTEGER },
            biologicalDomainAccuracyScore: { type: Type.INTEGER },
            csTranslationScore: { type: Type.INTEGER },
            topStrengthsObserved: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            priorityImprovementAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedLabMatches: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "overallScore",
            "hiringDecision",
            "interviewerSummary",
            "algorithmicIntuitionScore",
            "biologicalDomainAccuracyScore",
            "csTranslationScore",
            "topStrengthsObserved",
            "priorityImprovementAreas",
            "recommendedLabMatches",
            "recommendedNextSteps"
          ]
        }
      }
    });

    const raw = response.text || "{}";
    const parsed = JSON.parse(raw);

    return res.json({ result: parsed, isFallback: false });
  } catch (error: any) {
    console.error("Error in interview report:", error);
    const fallbackReport = generateDeterministicReport(
      req.body.turns || [],
      req.body.targetRole || "Computational Genomics & NGS Pipeline Engineer",
      req.body.targetLab || "CSIR-IGIB",
      req.body.difficulty || "Fresher / Project Trainee"
    );
    return res.json({ result: fallbackReport, isFallback: true, error: error.message });
  }
});

// Deterministic Interview Fallback Helpers
function generateDeterministicInterviewStart(
  targetRole: string,
  targetLab: string,
  difficulty: string,
  resumeSnippet: string
) {
  const isR = /r programming|bioconductor|deseq2|seurat/i.test(resumeSnippet + targetRole);
  const isAI = /drug discovery|pytorch|molecular|alphafold/i.test(targetRole);

  const persona = {
    name: isR ? "Dr. Rakesh K. Mishra" : isAI ? "Dr. Mukund Thattai" : "Dr. Anurag Agrawal",
    title: "Senior Principal Investigator & Faculty Chair",
    organization: targetLab
  };

  const firstQuestion = isR ? {
    id: "q-1",
    questionNumber: 1,
    question: "Welcome! Given your CS background, why do standard RNA-seq differential expression packages like DESeq2 use a Negative Binomial distribution rather than a Poisson distribution when modeling gene counts?",
    category: "R / Statistical Genomics",
    conceptTested: "Biological overdispersion vs technical variance in high-throughput count data",
    hintForCS: "Think about mean-variance relationships in Poisson (mean = variance) versus real biological replicates where variance > mean due to biological stochasticity.",
    timestamp: new Date().toISOString()
  } : isAI ? {
    id: "q-1",
    questionNumber: 1,
    question: "Welcome! In computational drug discovery, why do Graph Neural Networks (GNNs) outperform traditional Convolutional Neural Networks (CNNs) when predicting small molecule binding affinity?",
    category: "AI & Structural Biology",
    conceptTested: "Non-Euclidean molecular graph representations (atoms as nodes, covalent bonds as edges)",
    hintForCS: "Recall that 3D molecules are permutation-invariant non-Euclidean graphs where bond angles and topological connectivity cannot be rigidly flattened into a 2D/3D pixel grid.",
    timestamp: new Date().toISOString()
  } : {
    id: "q-1",
    questionNumber: 1,
    question: "Welcome! In high-throughput sequence alignment, why do aligners like BWA-MEM utilize the Burrows-Wheeler Transform (BWT) and FM-index instead of a standard Suffix Tree?",
    category: "Algorithms & String Search",
    conceptTested: "Memory-efficient string indexing and suffix array compression for 3-billion base pair genomes",
    hintForCS: "Consider the memory footprint. A standard Suffix Tree for the human genome requires 30-50 GB of RAM, whereas BWT + FM-index compresses the entire reference genome into ~2-3 GB of memory.",
    timestamp: new Date().toISOString()
  };

  return {
    sessionId: `interview-${Date.now()}`,
    interviewerPersona: persona,
    openingRemarks: `Good morning! We are excited to interview talented Computer Science engineers who want to apply computational craftsmanship to biology at ${targetLab}. Let's begin with a core technical concept.`,
    totalQuestions: 4,
    firstQuestion
  };
}

function generateDeterministicEvaluation(
  questionNumber: number,
  totalQuestions: number,
  question: string,
  category: string,
  userAnswer: string,
  targetRole: string,
  targetLab: string
) {
  const ansLength = userAnswer.trim().length;
  const hasCSKeywords = /complexity|o\(|memory|ram|tree|graph|array|matrix|variance|distribution|cache|thread|docker/i.test(userAnswer);
  const hasBioKeywords = /gene|rna|dna|genome|read|overdispersion|protein|binding|bwt|fastq|sam|deseq/i.test(userAnswer);

  let score = 7;
  if (ansLength > 120 && hasCSKeywords && hasBioKeywords) score = 9;
  else if (ansLength > 60 && (hasCSKeywords || hasBioKeywords)) score = 8;
  else if (ansLength < 40) score = 5;

  const isLast = questionNumber >= totalQuestions;

  const questionsPool = [
    {
      question: "When querying billions of genomic variants (VCFs) stored across multi-terabyte datasets, why is storing annotations in Apache Parquet queried with DuckDB/BigQuery significantly faster than relational row-based PostgreSQL or flat VCF.gz files?",
      category: "Databases & Cloud Genomics",
      conceptTested: "Columnar data storage, predicate pushdown, SIMD vectorization, and distributed partition pruning",
      hintForCS: "Parquet is columnar and compresses homogeneous variant columns (e.g. chromosome, allele frequency) heavily. DuckDB only reads the requested columns off disk/S3 (projection pushdown) and skips irrelevant chunks using min/max statistics (predicate pushdown)."
    },
    {
      question: "When aligning millions of FASTQ reads against a reference genome, what does a CIGAR string in a BAM file represent, and how does Samtools index this binary file?",
      category: "NGS Pipelines & HPC",
      conceptTested: "BAM alignment coordinate indexing (BAI format) and CIGAR string match/insertion/deletion operations",
      hintForCS: "CIGAR (Concise Idiosyncratic Gapped Alignment Report) encodes operations like 100M (100 matches) or 50M2I48M. Samtools uses a R-tree-like binning index for O(log N) coordinate queries."
    },
    {
      question: "How would you architect a fault-tolerant, cost-optimized genomic analysis pipeline on AWS or GCP handling 1,000 whole exome sequencing (WES) samples?",
      category: "Databases & Cloud Genomics",
      conceptTested: "Cloud object storage (AWS S3 / GCS), spot instance batch orchestration (AWS Batch / Slurm), containerization, and cost optimization",
      hintForCS: "Structure with S3 for raw/intermediate BAMs, Nextflow with AWS Batch executor using spot EC2 instances for 70% cost savings, Docker containers for reproducibility, and parquet outputs into BigQuery/Athena."
    },
    {
      question: "In RNA-seq multiple hypothesis testing across 20,000 genes, what is the mathematical difference between a Family-Wise Error Rate (Bonferroni) and False Discovery Rate (Benjamini-Hochberg)?",
      category: "R / Statistical Genomics",
      conceptTested: "Multiple comparison corrections (p-value adjustment, FDR vs FWER)",
      hintForCS: "Bonferroni controls the probability of ANY false positive (P(V >= 1)), which is overly conservative for 20k genes. Benjamini-Hochberg controls the expected proportion of false positives among significant discoveries (E[V/R])."
    },
    {
      question: "Why do workflow orchestrators like Nextflow or Snakemake use Directed Acyclic Graphs (DAGs) rather than traditional monolithic Shell scripts on Slurm HPC clusters?",
      category: "NGS Pipelines & HPC",
      conceptTested: "Fault-tolerant distributed execution, process-level caching, and dynamic DAG scheduling",
      hintForCS: "Highlight checkpoint recovery, automatic parallelization of independent branches, containerization (Docker/Singularity), and decoupled compute engines."
    }
  ];

  const nextQ = !isLast ? (questionsPool[questionNumber - 1] || questionsPool[0]) : null;

  return {
    feedback: {
      score,
      verdict: score >= 9 ? "Exceptional Algorithmic & Biological Synthesis" : score >= 7 ? "Solid CS Foundation with Clear Intuition" : "Promising Concept, Needs Biological Nuance",
      strengths: [
        "Clear articulation of computational efficiency and structural tradeoffs",
        "Demonstrated understanding of core data representations"
      ],
      csTranslationWin: hasCSKeywords ? "Directly related the biological challenge to computational space-time complexity." : "Approached the problem from a logical data structuring perspective.",
      blindspotsOrMistakes: score < 9 ? [
        "Could emphasize the specific biological implication on experimental noise and sample replication.",
        "Remember to mention standard tools (e.g. Samtools, DESeq2, BWA-MEM) when discussing real pipelines."
      ] : [],
      idealModelAnswer: "An optimal answer pairs algorithmic intuition with the exact biological context: identifying the mathematical bottleneck (memory/runtime/overdispersion) and explaining how modern bioinformatic algorithms compress or model the data efficiently."
    },
    isLastQuestion: isLast,
    nextQuestion: nextQ ? {
      id: `q-${questionNumber + 1}`,
      questionNumber: questionNumber + 1,
      question: nextQ.question,
      category: nextQ.category,
      conceptTested: nextQ.conceptTested,
      hintForCS: nextQ.hintForCS,
      timestamp: new Date().toISOString()
    } : null
  };
}

function generateDeterministicReport(
  turns: any[],
  targetRole: string,
  targetLab: string,
  difficulty: string
) {
  const scores = turns.map((t: any) => t.feedback?.score || 7);
  const avgScore = scores.length ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) : 78;

  return {
    overallScore: avgScore,
    hiringDecision: avgScore >= 85 ? "Strong Hire / Project Fellow" : avgScore >= 70 ? "Hire / High Potential Trainee" : "Promising with Minor Gaps",
    interviewerSummary: `The candidate demonstrates strong Computer Science fundamentals and an impressive ability to translate algorithmic principles into biological applications for ${targetRole}. Their logical problem-solving and software engineering intuition will be a strong asset in our computational biology lab at ${targetLab}.`,
    algorithmicIntuitionScore: Math.min(96, avgScore + 8),
    biologicalDomainAccuracyScore: Math.max(65, avgScore - 6),
    csTranslationScore: Math.min(94, avgScore + 4),
    topStrengthsObserved: [
      "Rapid mapping of CS data structures to genomic sequence problems",
      "Sound understanding of time-space complexity and memory optimization",
      "Enthusiastic and clear communication with structured technical explanations"
    ],
    priorityImprovementAreas: [
      "Deepen familiarity with specialized NGS file header flags (SAM CIGAR, VCF INFO/FORMAT fields)",
      "Review statistical dispersion estimation in R/Bioconductor (DESeq2/EdgeR)",
      "Practice containerizing Nextflow/Snakemake workflows with Docker"
    ],
    recommendedLabMatches: [
      `${targetLab}`,
      "CSIR-CCMB Transcriptomics & Genome Data Unit (Hyderabad)",
      "NCBS Computational Biology & Single-Cell Lab (Bengaluru)"
    ],
    recommendedNextSteps: [
      "Build one containerized Nextflow or R differential expression pipeline on GitHub to showcase in interviews",
      "Review 10 foundational bioinformatics interview problems on Rosalind.info",
      "Reach out to lab PIs with a tailored email highlighting your CS engineering craftsmanship"
    ]
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
