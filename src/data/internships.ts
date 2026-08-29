import { InternshipOpportunity } from '../types';

export const INITIAL_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: 'igib-trainee-2026',
    title: 'Genomics Data Science & Pipeline Project Trainee',
    organization: 'CSIR-IGIB (Institute of Genomics and Integrative Biology)',
    category: 'gov_research',
    location: 'New Delhi',
    workMode: 'On-site',
    stipend: '₹18,000 - ₹25,000 / month',
    duration: '6 Months (Jan - June / July - Dec)',
    deadline: 'Rolling / Bi-annual (Next cycle: Oct 15)',
    status: 'Open',
    csSkills: ['Python', 'Bash / Linux', 'Nextflow', 'Docker', 'SQL', 'FastAPI'],
    bioFocus: ['Variant Calling', 'RNA-Seq Analysis', 'Clinical Genomics', 'HPC Workflows'],
    description: 'Work alongside computational biologists on India’s largest genome sequencing datasets (IndiGen project). You will design automated workflow pipelines for high-throughput variant calling and develop internal microservices for clinical report generation.',
    csCandidateAdvantage: 'CS freshers with strong Linux shell scripting, Docker, and Python skills are preferred to replace slow legacy scripts with scalable parallel pipelines.',
    applicationProcedure: 'Apply through the CSIR-IGIB Trainee Portal or directly contact Principal Investigators (PIs) working in the Genomics & Molecular Medicine division with your GitHub and CV.',
    applicationUrl: 'https://www.igib.res.in/?q=trainees',
    contactEmail: 'hr@igib.in',
    isVerified: true,
    postedDate: '2026-08-20',
    featured: true,
  },
  {
    id: 'ccmb-compbio-intern',
    title: 'Computational Biology & Algorithm Intern',
    organization: 'CSIR-CCMB (Centre for Cellular & Molecular Biology)',
    category: 'gov_research',
    location: 'Hyderabad',
    workMode: 'On-site',
    stipend: '₹15,000 - ₹20,000 / month',
    duration: '3 to 6 Months',
    deadline: 'Oct 30 (Winter Batch) / Apr 15 (Summer Batch)',
    status: 'Open',
    csSkills: ['Python', 'C++', 'Data Structures & Algorithms', 'Pandas', 'Git'],
    bioFocus: ['Genome Assembly', 'Phylogenetics', 'Population Genetics', 'Graph Algorithms'],
    description: 'Contribute to building high-speed sequence alignment graph algorithms and population-scale genomics tools for endangered wildlife and human health research.',
    csCandidateAdvantage: 'Algorithm optimization in C++ and graph theory applications for de Bruijn graph genome assembly make CS background a direct asset.',
    applicationProcedure: 'Submit application via CCMB Training & Dissertation portal with a Statement of Purpose (SOP) and academic recommendation letter.',
    applicationUrl: 'https://www.ccmb.res.in/Academics/Training-Dissertation-Programs',
    contactEmail: 'hrd@ccmb.res.in',
    isVerified: true,
    postedDate: '2026-08-22',
    featured: true,
  },
  {
    id: 'iiith-ccnsb-research',
    title: 'AI for Molecular Dynamics & Drug Design Intern',
    organization: 'IIIT Hyderabad – CCNSB',
    category: 'gov_research',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    stipend: '₹16,000 - ₹22,000 / month',
    duration: '3 to 6 Months',
    deadline: 'Rolling',
    status: 'Open',
    csSkills: ['PyTorch / TensorFlow', 'Graph Neural Networks (GNNs)', 'Python', 'C++ / CUDA'],
    bioFocus: ['Molecular Docking', 'Protein-Ligand Interaction', 'Structure Prediction'],
    description: 'Develop Deep Learning models for molecular property prediction and accelerated molecular dynamics simulations on NVIDIA GPU clusters.',
    csCandidateAdvantage: 'High demand for CS engineers who understand PyTorch Geometric, 3D coordinate representations, and GPU acceleration.',
    applicationProcedure: 'Email your CV and GitHub repository links directly to CCNSB faculty (Dr. Deva Priyakumar or Dr. Nita Parekh) outlining your machine learning coursework.',
    applicationUrl: 'https://ccnsb.iiit.ac.in/',
    contactEmail: 'ccnsb_contact@iiit.ac.in',
    isVerified: true,
    postedDate: '2026-08-25',
    featured: true,
  },
  {
    id: 'ncbs-bio-image-intern',
    title: 'Bio-Image Informatics & Vision Computing Intern',
    organization: 'NCBS & InStem (TIFR)',
    category: 'gov_research',
    location: 'Bengaluru',
    workMode: 'On-site',
    stipend: '₹20,000 / month + Campus Subsidy',
    duration: '6 Months',
    deadline: 'Nov 15 (Annual Fellowship Cycle)',
    status: 'Open',
    csSkills: ['Computer Vision', 'OpenCV', 'PyTorch', 'Python', 'NumPy / SciPy'],
    bioFocus: ['Cryo-EM Image Analysis', 'Cell Segmentation', 'Fluorescence Microscopy'],
    description: 'Work with the Central Imaging Facility to build 3D reconstruction and segmentation models for high-resolution electron microscopy and live-cell tracking.',
    csCandidateAdvantage: 'Computer vision and deep learning architectures (U-Net, SAM, 3D CNNs) are directly transferred from standard CS CV domains to biological imaging.',
    applicationProcedure: 'Apply via NCBS Academic Trainee / Summer Research Program portal.',
    applicationUrl: 'https://www.ncbs.res.in/academic/fellowships',
    contactEmail: 'studentoffice@ncbs.res.in',
    isVerified: true,
    postedDate: '2026-08-18',
  },
  {
    id: 'strand-life-sciences-intern',
    title: 'Bioinformatics Software Engineering Intern',
    organization: 'Strand Life Sciences',
    category: 'top_enterprise',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    stipend: '₹30,000 - ₹40,000 / month (PPO Track)',
    duration: '6 Months',
    deadline: 'Rolling (Immediate Start)',
    status: 'Open',
    csSkills: ['Python', 'Java / Spring', 'AWS / Cloud', 'Docker', 'PostgreSQL', 'REST APIs'],
    bioFocus: ['Clinical NGS Reporting', 'Oncology Genomics', 'Database Optimization'],
    description: 'Design robust backend services and cloud data pipelines processing terabytes of patient genomic data for cancer and rare disease diagnosis worldwide.',
    csCandidateAdvantage: 'Strand explicitly recruits CS graduates for their platform engineering team to build enterprise-grade software and distributed pipelines.',
    applicationProcedure: 'Apply on Strand Life Sciences Careers page or via campus referral on LinkedIn with subject "[CS Fresher] Bioinformatics SE Intern".',
    applicationUrl: 'https://strandls.com/careers/',
    contactEmail: 'careers@strandls.com',
    isVerified: true,
    postedDate: '2026-08-26',
    featured: true,
  },
  {
    id: 'medgenome-pipeline-intern',
    title: 'Genomic Data Pipeline & Cloud Engineering Intern',
    organization: 'MedGenome Labs',
    category: 'top_enterprise',
    location: 'Bengaluru',
    workMode: 'On-site',
    stipend: '₹25,000 - ₹35,000 / month',
    duration: '6 Months',
    deadline: 'Nov 01',
    status: 'Open',
    csSkills: ['Python', 'Snakemake / Nextflow', 'AWS S3 & EC2', 'Linux Shell', 'Kubernetes'],
    bioFocus: ['Whole Exome Sequencing (WES)', 'Liquid Biopsy', 'Variant Annotation'],
    description: 'Scale genomic processing pipelines on AWS cloud infrastructure, optimizing execution time and reducing computational costs for high-throughput clinical sequencing.',
    csCandidateAdvantage: 'System architecture, cloud cost optimization, and parallel computing skills give CS candidates an edge.',
    applicationProcedure: 'Submit resume through MedGenome careers portal or write to talent acquisition team with sample workflow projects.',
    applicationUrl: 'https://www.medgenome.com/careers/',
    contactEmail: 'jobs@medgenome.com',
    isVerified: true,
    postedDate: '2026-08-24',
  },
  {
    id: 'elucidata-data-engineer',
    title: 'Biomedical Data Platform Engineering Intern',
    organization: 'Elucidata',
    category: 'top_enterprise',
    location: 'Delhi NCR / Bengaluru / Remote',
    workMode: 'Hybrid',
    stipend: '₹35,000 - ₹45,000 / month',
    duration: '3 to 6 Months',
    deadline: 'Rolling',
    status: 'Open',
    csSkills: ['Python', 'FastAPI', 'Pandas', 'Docker', 'ElasticSearch / Vector DBs', 'TypeScript'],
    bioFocus: ['Multi-Omics Harmonization', 'RNA-Seq Normalization', 'Polly Platform'],
    description: 'Build data ingestion crawlers, schema normalizers, and search indexes for Polly—a leading biomedical data engine used by global pharma leaders (Pfizer, Genentech).',
    csCandidateAdvantage: 'High overlap with standard backend & data engineering stack; biological domain training is provided on-job.',
    applicationProcedure: 'Apply via Elucidata AngelList/Wellfound or official careers portal.',
    applicationUrl: 'https://elucidata.io/careers',
    contactEmail: 'talent@elucidata.io',
    isVerified: true,
    postedDate: '2026-08-27',
    featured: true,
  },
  {
    id: 'bugworks-ai-drug-intern',
    title: 'AI/ML for Drug Discovery Intern',
    organization: 'Bugworks Research',
    category: 'biotech_startup',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    stipend: '₹28,000 - ₹38,000 / month',
    duration: '6 Months',
    deadline: 'Rolling',
    status: 'Open',
    csSkills: ['PyTorch', 'RDKit', 'Cheminformatics', 'Python', 'Diffusion Models'],
    bioFocus: ['Antibacterial Drug Design', 'Immuno-Oncology', 'Molecular Generation'],
    description: 'Develop generative models (Diffusion & Transformers) for small-molecule chemical generation and virtual screening against resistant bacterial targets.',
    csCandidateAdvantage: 'Generative AI and molecular graph representations are the core focus; CS candidates with ML fundamentals excel here.',
    applicationProcedure: 'Email portfolio/GitHub and resume to Bugworks hiring team with subject "ML Drug Discovery Intern - [Your Name]".',
    applicationUrl: 'https://bugworksresearch.com/',
    contactEmail: 'contact@bugworksresearch.com',
    isVerified: true,
    postedDate: '2026-08-21',
  },
  {
    id: 'iasc-srfp-2026',
    title: 'IASc-INSA-NASI Summer Research Fellowship (Computational Biology)',
    organization: 'Indian Academy of Sciences (IISc, IITs, CSIR pan-India)',
    category: 'fellowship',
    location: 'Pan-India (IISc / IITs / IISERs)',
    workMode: 'On-site',
    stipend: '₹12,500 / month + Travel & Accommodation',
    duration: '2 Months (Summer Fellowship)',
    deadline: 'Nov 30, 2026 (Annual National Portal)',
    status: 'Upcoming',
    csSkills: ['Programming (C/C++/Python)', 'Mathematics & Statistics', 'Algorithms'],
    bioFocus: ['Computational Biophysics', 'Systems Biology', 'Genomic Algorithms'],
    description: 'Prestigious national fellowship pairing top CS/Engineering students with eminent academy fellows across IISc Bengaluru, IIT Bombay, IIT Madras, and NCBS.',
    csCandidateAdvantage: 'Special quota for engineering and computer science students interested in biological and biophysical computing problems.',
    applicationProcedure: 'Submit online application on the Indian Academy of Sciences web portal with 2 teacher references and a 200-word write-up.',
    applicationUrl: 'https://web-japps.ias.ac.in/fellowship2026/',
    contactEmail: 'fellowship@ias.ac.in',
    isVerified: true,
    postedDate: '2026-08-15',
    featured: true,
  },
  {
    id: 'cdac-hpc-bioinfo-intern',
    title: 'HPC & High-Throughput Bioinformatics Intern',
    organization: 'C-DAC (Centre for Development of Advanced Computing)',
    category: 'gov_research',
    location: 'Pune / Bengaluru',
    workMode: 'On-site',
    stipend: '₹18,000 / month',
    duration: '6 Months',
    deadline: 'Rolling',
    status: 'Open',
    csSkills: ['MPI / OpenMP', 'C/C++', 'Linux HPC Clusters', 'Slurm', 'Python'],
    bioFocus: ['Parallel BLAST', 'PARAM Supercomputing Applications', 'Genome Assembly'],
    description: 'Work on scaling bioinformatics software packages (such as BLAST, GROMACS, and BWA) across India’s PARAM supercomputers utilizing parallel computing.',
    csCandidateAdvantage: 'High Performance Computing (HPC), parallel computing (MPI/CUDA), and operating systems are prime CS domains.',
    applicationProcedure: 'Apply through the C-DAC Project Internships and dissertation scheme portal.',
    applicationUrl: 'https://cdac.in/index.aspx?id=careers',
    contactEmail: 'actspune@cdac.in',
    isVerified: true,
    postedDate: '2026-08-19',
  },
  {
    id: 'iit-delhi-scfbio',
    title: 'Supercomputing & Biomolecular Modeling Intern',
    organization: 'IIT Delhi – SCFBIO (Supercomputing Facility for Bioinformatics)',
    category: 'gov_research',
    location: 'New Delhi',
    workMode: 'On-site',
    stipend: '₹15,000 - ₹20,000 / month',
    duration: '3 to 6 Months',
    deadline: 'Dec 15 (Winter batch)',
    status: 'Open',
    csSkills: ['Python', 'C++', 'Algorithms', 'Web Development (React / Django)'],
    bioFocus: ['Dhanvantari Drug Suite', 'Protein Folding', 'Molecular Docking Algorithms'],
    description: 'Contribute to India’s proprietary in-silico drug design software suite "Dhanvantari", developing computational algorithms and user-facing web tools.',
    csCandidateAdvantage: 'Development of web platforms and algorithm optimization for supercomputing clusters.',
    applicationProcedure: 'Send application to the Coordinator, SCFBIO, IIT Delhi along with statement of purpose.',
    applicationUrl: 'http://www.scfbio-iitd.res.in/',
    contactEmail: 'scfbio@iitd.ac.in',
    isVerified: true,
    postedDate: '2026-08-17',
  },
  {
    id: 'mapmygenome-intern',
    title: 'Genomics Bioinformatics & Cloud Trainee',
    organization: 'Mapmygenome India',
    category: 'biotech_startup',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    stipend: '₹20,000 - ₹25,000 / month',
    duration: '6 Months (Convertible)',
    deadline: 'Rolling',
    status: 'Open',
    csSkills: ['Python', 'SQL', 'REST API', 'Data Visualization (D3 / Recharts)', 'Git'],
    bioFocus: ['Preventive Genomics', 'Microbiome Analytics', 'Health Risk Prediction'],
    description: 'Assist in building consumer health dashboards and automated genetic risk scoring algorithms from raw micro-array and sequencing data.',
    csCandidateAdvantage: 'Full-stack engineering combined with statistical data processing.',
    applicationProcedure: 'Submit CV to Mapmygenome careers portal with sample data visualization or Python scripts.',
    applicationUrl: 'https://mapmygenome.in/careers',
    contactEmail: 'info@mapmygenome.in',
    isVerified: true,
    postedDate: '2026-08-23',
  },
  {
    id: 'astrazeneca-biomedical-intern',
    title: 'Biomedical Data Science & AI Intern',
    organization: 'AstraZeneca Global Innovation Hub',
    category: 'top_enterprise',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    stipend: '₹40,000 - ₹50,000 / month',
    duration: '6 Months',
    deadline: 'Oct 31',
    status: 'Open',
    csSkills: ['Python', 'PyTorch', 'Data Engineering', 'Azure Cloud', 'SQL', 'NLP / LLMs'],
    bioFocus: ['Translational Medicine', 'Clinical Trial Analytics', 'Biomedical Literature Mining'],
    description: 'Leverage LLMs and biomedical knowledge graphs to extract actionable therapeutic targets from scientific literature and clinical trial datasets.',
    csCandidateAdvantage: 'NLP, Knowledge Graphs, and Cloud pipeline skills directly align with AstraZeneca’s enterprise data science needs.',
    applicationProcedure: 'Apply through AstraZeneca Early Talent / University hiring portal.',
    applicationUrl: 'https://careers.astrazeneca.com/india',
    contactEmail: 'talentacquisition.india@astrazeneca.com',
    isVerified: true,
    postedDate: '2026-08-28',
    featured: true,
  },
  {
    id: 'ibab-bengaluru-intern',
    title: 'Big Data in Multi-Omics Research Trainee',
    organization: 'IBAB (Institute of Bioinformatics & Applied Biotechnology)',
    category: 'gov_research',
    location: 'Bengaluru (Biotech Park, Electronic City)',
    workMode: 'On-site',
    stipend: '₹15,000 - ₹18,000 / month',
    duration: '4 to 6 Months',
    deadline: 'Rolling / Dec 01',
    status: 'Open',
    csSkills: ['Python', 'R', 'Linux', 'Database Management', 'Machine Learning'],
    bioFocus: ['Single-Cell RNA-Seq', 'Spatial Transcriptomics', 'Epigenomics Databases'],
    description: 'Work in world-class research labs developing high-dimensional statistical clustering models and relational databases for single-cell cancer atlases.',
    csCandidateAdvantage: 'CS students with strong linear algebra, dimensionality reduction (PCA, UMAP, t-SNE), and clustering algorithm skills are prioritized.',
    applicationProcedure: 'Submit dissertation/internship application on the IBAB institutional portal.',
    applicationUrl: 'https://www.ibab.ac.in/academic-programmes/internships/',
    contactEmail: 'internships@ibab.ac.in',
    isVerified: true,
    postedDate: '2026-08-16',
  }
];

export const CS_BIO_SKILL_ROADMAP = [
  {
    id: 'step1',
    title: '1. Python for Biology & Sequence Handling',
    tag: 'Foundation',
    difficulty: 'Beginner',
    timeEst: '1-2 Weeks',
    description: 'How to manipulate DNA/RNA/Protein strings, parse FASTA/FASTQ files with Biopython, and calculate GC-content & ORF translations efficiently.',
    csConcept: 'String algorithms, regex parsing, hash maps, binary file I/O',
    bioConcept: 'Central Dogma (DNA -> RNA -> Protein), Nucleotide complements, codon tables',
    codeSnippet: `from Bio import SeqIO
from Bio.Seq import Seq

# Parse FASTQ reads and compute quality filtering
def filter_high_quality_reads(fastq_file, min_quality=30):
    high_qual_count = 0
    for record in SeqIO.parse(fastq_file, "fastq"):
        avg_q = sum(record.letter_annotations["phred_quality"]) / len(record)
        if avg_q >= min_quality:
            high_qual_count += 1
    return high_qual_count`
  },
  {
    id: 'step2',
    title: '2. Linux Shell, HPC & Nextflow Pipelines',
    tag: 'Industry Standard',
    difficulty: 'Intermediate',
    timeEst: '2 Weeks',
    description: 'Modern bioinformatics runs on Linux supercomputers using workflow managers (Nextflow / Snakemake) and containerization (Docker / Singularity).',
    csConcept: 'Process parallelism, DAG (Directed Acyclic Graph) execution, containerization, Slurm scheduler',
    bioConcept: 'NGS pipeline steps: Quality Control (FastQC) -> Alignment (BWA-MEM) -> Sorting (Samtools) -> Variant Calling (GATK)',
    codeSnippet: '// Sample Nextflow process for sequence alignment\\n' +
      'process ALIGN_READS {\\n' +
      '    tag "${sample_id}"\\n' +
      '    container "biocontainers/bwa:v0.7.17"\\n\\n' +
      '    input:\\n' +
      '    tuple val(sample_id), path(reads)\\n' +
      '    path reference_genome\\n\\n' +
      '    output:\\n' +
      '    tuple val(sample_id), path("${sample_id}.bam")\\n\\n' +
      '    script:\\n' +
      '    """\\n' +
      '    bwa mem -t 8 $reference_genome $reads | \\\\\\n' +
      '    samtools sort -@ 4 -o ${sample_id}.bam\\n' +
      '    """\\n' +
      '}'
  },
  {
    id: 'step3',
    title: '3. Deep Learning & GNNs in Drug Discovery',
    tag: 'High-Demand AI',
    difficulty: 'Advanced',
    timeEst: '3 Weeks',
    description: 'Representing molecules as graphs where atoms are nodes and chemical bonds are edges to predict affinity, toxicity, and 3D folding.',
    csConcept: 'Graph Neural Networks (Message Passing, GCN, GAT), 3D Geometric Deep Learning, Transformers',
    bioConcept: 'Small-molecule SMILES strings, SMILES-to-Graph conversion, target binding pockets, AlphaFold2 embeddings',
    codeSnippet: `import torch
from torch_geometric.nn import GCNConv, global_mean_pool

class MolecularPropertyGNN(torch.nn.Module):
    def __init__(self, in_features, hidden_dim, num_classes=1):
        super().__init__()
        self.conv1 = GCNConv(in_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.fc = torch.nn.Linear(hidden_dim, num_classes)

    def forward(self, x, edge_index, batch):
        x = torch.relu(self.conv1(x, edge_index))
        x = torch.relu(self.conv2(x, edge_index))
        x = global_mean_pool(x, batch) # Aggregate atom embeddings to molecular level
        return self.fc(x)`
  },
  {
    id: 'step4',
    title: '4. Big Data & Single-Cell Transcriptomics',
    tag: 'Data Science',
    difficulty: 'Intermediate',
    timeEst: '2 Weeks',
    description: 'Processing massive matrices of 50,000 genes across 1,000,000 individual cells to identify disease cell subtypes.',
    csConcept: 'Sparse matrices (CSR/CSC), PCA, UMAP, Leiden graph clustering, high-dimensional normalization',
    bioConcept: 'Gene expression counts, cell-type clustering, differential expression analysis (Scanpy / AnnData)',
    codeSnippet: `import scanpy as sc

# Standard Single-cell pipeline using Scanpy
adata = sc.read_10x_h5("filtered_feature_bc_matrix.h5")
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.normalize_total(adata, target_sum=1e4)
sc.pp.log1p(adata)
sc.pp.highly_variable_genes(adata, n_top_genes=2000)
sc.tl.pca(adata, svd_solver='arpack')
sc.pp.neighbors(adata, n_neighbors=15, n_pcs=30)
sc.tl.umap(adata)
sc.tl.leiden(adata, resolution=0.8)`
  },
  {
    id: 'step5',
    title: '5. R Language & Bioconductor (DESeq2 & Seurat)',
    tag: 'Statistical Genomics',
    difficulty: 'Intermediate',
    timeEst: '2 Weeks',
    description: 'R is the gold standard for statistical genomics, differential gene expression (DESeq2/EdgeR), and publication-ready volcano/heatmaps with ggplot2.',
    csConcept: 'Vectorized dataframes, functional programming (lapply/purrr), S4 object-oriented data structures, statistical hypothesis testing (FDR/p-values)',
    bioConcept: 'RNA-seq raw count normalization, dispersion estimation, Wald test for log2-fold changes, Seurat single-cell workflows',
    codeSnippet: `# R & Bioconductor: Differential Gene Expression with DESeq2
library(DESeq2)
library(ggplot2)

# 1. Create DESeq2 Dataset from count matrix and sample metadata
dds <- DESeqDataSetFromMatrix(
  countData = count_matrix,
  colData = col_data,
  design = ~ condition # e.g. Tumor vs Normal
)

# 2. Run standard DESeq differential expression pipeline
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "treated", "control"))
res_sig <- subset(res, padj < 0.05 & abs(log2FoldChange) > 1.5)

# 3. Generate Volcano Plot with ggplot2
ggplot(as.data.frame(res), aes(x = log2FoldChange, y = -log10(pvalue))) +
  geom_point(aes(color = padj < 0.05), alpha = 0.6) +
  theme_minimal() +
  labs(title = "Differential Expression Volcano Plot (DESeq2)")`
  },
  {
    id: 'step6',
    title: '6. Biological Databases, Cloud Omics & BigQuery SQL',
    tag: 'Cloud & Databases',
    difficulty: 'Intermediate',
    timeEst: '2 Weeks',
    description: 'Querying public biological databases (NCBI Entrez, Ensembl REST, UniProt, UCSC, TCGA) and running petabyte-scale variant queries on AWS Batch, GCP Life Sciences, and DuckDB/BigQuery.',
    csConcept: 'REST APIs & rate-limiting, SQL/NoSQL schema design, DuckDB / Apache Parquet columnar storage, AWS S3 / GCP Cloud Storage, AWS Batch spot instances',
    bioConcept: 'NCBI SRA (Sequence Read Archive), Ensembl GRCh38 variant annotations, ClinVar clinical significance, TCGA cancer cohort survival data, gnomAD allele frequencies',
    codeSnippet: `import requests
from Bio import Entrez
import duckdb

# 1. Programmatic NCBI Entrez API Query
Entrez.email = "developer@research.ac.in"
handle = Entrez.esearch(db="pubmed", term="CRISPR Cas9 cancer immunotherapy", retmax=5)
record = Entrez.read(handle)
print("Matching PubMed IDs:", record["IdList"])

# 2. Ensembl REST API: Fetch human gene coordinates (GRCh38)
server = "https://rest.ensembl.org"
ext = "/lookup/symbol/homo_sapiens/BRCA1?expand=1"
r = requests.get(server + ext, headers={"Content-Type": "application/json"})
gene_info = r.json()
print(f"BRCA1 Chromosome: {gene_info['seq_region_name']}, Start: {gene_info['start']}, End: {gene_info['end']}")

# 3. High-Speed SQL Variant Query on Parquet with DuckDB
con = duckdb.connect()
con.execute("""
    SELECT chrom, pos, ref, alt, gene_symbol, clinical_significance
    FROM read_parquet('s3://public-genomics-bucket/clinvar_variants.parquet')
    WHERE gene_symbol IN ('BRCA1', 'TP53', 'EGFR')
      AND clinical_significance LIKE '%Pathogenic%'
    ORDER BY chrom, pos
    LIMIT 10
""")
print(con.fetchdf())`
  }
];

export const ATS_BIOINFO_KEYWORDS = [
  'Python', 'R', 'R Programming', 'Bioconductor', 'DESeq2', 'Seurat', 'ggplot2',
  'Nextflow', 'Snakemake', 'Docker', 'Linux/Bash', 'EdgeR', 'GenomicRanges',
  'NCBI Entrez', 'Ensembl REST', 'UCSC Table Browser', 'UniProt / PDB', 'TCGA / GDC', 'ClinVar', 'gnomAD',
  'SQL / PostgreSQL', 'DuckDB', 'Apache Parquet', 'AWS Batch / S3', 'GCP Life Sciences / BigQuery',
  'PyTorch', 'TensorFlow', 'Graph Neural Networks', 'RDKit', 'FASTA/FASTQ',
  'BAM/SAM', 'VCF', 'GATK', 'BWA', 'BLAST', 'Scanpy',
  'Molecular Dynamics', 'High-Performance Computing (HPC)', 'AWS/GCP', 'SQL',
  'Single-Cell RNA-seq', 'Variant Calling', 'Protein Folding'
];

export interface SampleResumePreset {
  id: string;
  name: string;
  badge: string;
  targetRole: string;
  text: string;
}

export const TARGET_BIOINFO_ROLES = [
  {
    id: 'genomics_pipeline',
    title: 'Computational Genomics & NGS Pipeline Engineer',
    labs: 'CSIR-IGIB, Strand Life Sciences, MedGenome',
    icon: 'Terminal',
    coreReqs: ['Nextflow/Snakemake', 'Python', 'R / Bioconductor', 'Linux/Bash', 'Docker', 'BWA/Samtools/GATK', 'VCF analysis']
  },
  {
    id: 'cloud_genomic_db',
    title: 'Cloud Genomics & Biological Database Engineer',
    labs: 'Strand Life Sciences, MedGenome, Elucidata, CSIR-IGIB',
    icon: 'Database',
    coreReqs: ['AWS Batch / S3', 'GCP / BigQuery', 'SQL / PostgreSQL / DuckDB', 'NCBI Entrez / Ensembl REST', 'Nextflow on Cloud', 'Docker / K8s']
  },
  {
    id: 'r_bioconductor_stats',
    title: 'Statistical Genomics & R / Bioconductor Specialist',
    labs: 'CSIR-CCMB, NCBS & InStem, ACTREC Mumbai',
    icon: 'BarChart',
    coreReqs: ['R Language', 'Bioconductor', 'DESeq2 / EdgeR', 'Seurat (Single-Cell)', 'ggplot2', 'Statistical Testing']
  },
  {
    id: 'ai_drug_discovery',
    title: 'AI Drug Discovery & Molecular ML Engineer',
    labs: 'Bugworks Research, IIIT-H CCNSB, AstraZeneca Hub',
    icon: 'Brain',
    coreReqs: ['PyTorch / PyTorch Geometric', 'RDKit', 'Molecular Graphs / GNNs', 'AlphaFold / PDB', 'Python']
  },
  {
    id: 'single_cell_data_science',
    title: 'Single-Cell Genomics & Multi-Omics Data Scientist',
    labs: 'NCBS & InStem, Elucidata, CSIR-CCMB',
    icon: 'Layers',
    coreReqs: ['R / Seurat', 'Python / Scanpy', 'AnnData (.h5ad)', 'PCA/UMAP', 'Leiden Clustering', 'High-Dim Statistics']
  },
  {
    id: 'bioinfo_algorithm_dev',
    title: 'High-Performance Sequence Algorithm Developer',
    labs: 'IIT Delhi SCFBIO, C-DAC Supercomputing, IISc',
    icon: 'Cpu',
    coreReqs: ['C++ / CUDA', 'Dynamic Programming', 'Suffix Trees / BWT', 'Slurm / HPC', 'Parallel Computing']
  }
];

export const SAMPLE_RESUMES: SampleResumePreset[] = [
  {
    id: 'cs_cloud_databases',
    name: 'CS + Cloud & Databases: AWS, SQL & Bio-APIs',
    badge: 'Cloud & Databases',
    targetRole: 'Cloud Genomics & Biological Database Engineer',
    text: `ADITYA MENON
B.Tech in Computer Science & Engineering | CGPA: 8.9/10
GitHub: github.com/aditya-cloud-bio | Email: aditya.m@cs.ac.in

TECHNICAL SKILLS:
• Cloud & Infrastructure: AWS (S3, EC2, Batch, Lambda), Google Cloud Platform (BigQuery, GCS), Docker, Kubernetes, Linux / Bash
• Databases & Data Querying: SQL (PostgreSQL, DuckDB, SQLite), Apache Parquet, Apache Arrow, REST APIs (NCBI Entrez, Ensembl REST, UniProt)
• Programming & Pipelines: Python (Biopython, Pandas, FastAPI, SQLAlchemy), R (tidyverse), Nextflow (AWS Batch executor)

PROJECTS & LAB EXPERIENCE:
1. Serverless Genomic Variant Search API with DuckDB & AWS S3
   • Created FastAPI microservice querying 10M+ ClinVar and gnomAD variants stored as columnar Parquet on AWS S3 with DuckDB, cutting lookup latency to <120ms without spinning up a persistent database cluster.
2. Automated NCBI & Ensembl Bio-Data Harvester
   • Built rate-limited Python ETL pipeline querying NCBI Entrez and Ensembl REST APIs to retrieve gene boundaries, transcript coordinates, and pathogenic mutation metadata for 500 cancer-driver genes.
3. Scalable Nextflow Pipeline Deployment on AWS Batch
   • Containerized BWA-MEM and GATK variant calling pipeline using Docker and deployed with spot instances on AWS Batch, processing 100GB FASTQ data at 65% reduced cloud compute cost.`
  },
  {
    id: 'cs_r_bioconductor',
    name: 'CS + R Language: Statistical Genomics & Bioconductor',
    badge: 'R & Bioconductor',
    targetRole: 'Statistical Genomics & R / Bioconductor Specialist',
    text: `VIKAS K.
B.Tech in Computer Science & Engineering | CGPA: 8.8/10
GitHub: github.com/vikas-bioinfo | Email: vikas.cs@example.ac.in

TECHNICAL SKILLS:
• Programming & Statistics: R (Bioconductor, DESeq2, Seurat, ggplot2, dplyr, tidyverse), Python (Pandas, NumPy, Biopython), C++, Bash / Linux
• Data & Statistical Analysis: Hypothesis Testing (p-value, FDR, Benjamini-Hochberg), PCA, Differential Gene Expression, Volcano plots, Heatmaps
• Software Engineering: Git, Docker, Object-Oriented Design, Linux Shell Scripting, Data Structures & Algorithms

PROJECTS & LAB WORK:
1. Differential RNA-seq Expression Pipeline with R & DESeq2
   • Processed count matrices across 30 patient samples to identify statistically significant upregulated and downregulated biomarkers (padj < 0.01).
   • Generated publication-grade interactive Volcano plots and clustered heatmaps with ggplot2 and ComplexHeatmap.
2. Single-Cell Quality Control & Clustering using R / Seurat
   • Normalized 10x Genomics scRNA-seq dataset, filtered low-quality cells by mitochondrial gene percentages, and performed PCA dimensionality reduction.
3. Fast Sequence String Indexing & K-mer Matcher in C++ and Python
   • Built high-speed sequence parser and hash-table k-mer indexer for FASTQ files.`
  },
  {
    id: 'cs_python_ml',
    name: 'CS Fresher: Python, PyTorch & Linux Data Engineer',
    badge: 'Python + ML',
    targetRole: 'Computational Genomics & NGS Pipeline Engineer',
    text: `RAHUL SHARMA
B.Tech in Computer Science & Engineering, National Institute of Technology (NIT) | CGPA: 8.7/10
GitHub: github.com/rahul-cs | Email: rahul.sharma@nit.ac.in

TECHNICAL SKILLS:
• Languages: Python (Proficient), R (Basic / Bioconductor), C++, SQL, Bash / Linux Shell Scripting
• Frameworks & Tools: PyTorch, scikit-learn, Docker, Git, FastAPI, Pandas, NumPy
• Concepts: Data Structures & Algorithms, Object-Oriented Design, Distributed Computing, Parallel Processing

PROJECTS:
1. High-Throughput Log Processing & Anomaly Detection Pipeline
   • Built distributed ETL pipeline in Python and Docker processing 500k log events/sec using multiprocessing.
   • Containerized microservices using Docker Compose and deployed on Ubuntu Linux server.
2. Graph Neural Network for Molecular Property Prediction
   • Implemented Graph Convolutional Network (GCN) using PyTorch Geometric on benchmark chemical datasets.
   • Parsed SMILES molecular strings into graph representations with node features for atom types.
3. String Matching & Suffix Tree Search Benchmarking
   • Implemented Knuth-Morris-Pratt (KMP) and Suffix Array indexing algorithms in C++ for large-scale string pattern matching.`
  },
  {
    id: 'cs_cpp_systems',
    name: 'CS Student: C++, Low-Level Systems & HPC',
    badge: 'C++ & HPC',
    targetRole: 'High-Performance Sequence Algorithm Developer',
    text: `PRIYA VERMA
B.Tech in Computer Science | Indian Institute of Information Technology (IIIT) | CGPA: 9.1/10
GitHub: github.com/priya-cpp | Email: priya.v@iiit.ac.in

TECHNICAL SKILLS:
• Programming: C++, C, Python, R, CUDA, Bash
• Systems & Architecture: Linux kernel concepts, Multithreading (pthreads, OpenMP), Cache optimization, Memory management, Slurm HPC
• Core CS: Advanced Dynamic Programming, Graph Theory, Trie / Suffix Automata, Hash Maps

ACADEMIC & OPEN SOURCE PROJECTS:
1. Parallel Matrix Multiplication & Dynamic Programming Engine (CUDA / C++)
   • Accelerated 2D dynamic programming grid computations by 18x utilizing NVIDIA CUDA shared memory kernels.
2. Low-Latency High-Throughput In-Memory Key-Value Store
   • Designed concurrent hash map in C++17 with lock-free ring buffers and SIMD vectorization.
3. DNA String Pattern Search & Alignment Tool
   • Built custom Needleman-Wunsch global alignment tool in C++ benchmarking cache hit rates vs standard Python.`
  },
  {
    id: 'fullstack_backend_dev',
    name: 'Software Engineer: Backend, Docker & Cloud Pipelines',
    badge: 'Backend / Cloud',
    targetRole: 'Single-Cell Genomics & Multi-Omics Data Scientist',
    text: `ANANYA IYER
B.E. Computer Science & Engineering | Anna University | Experience: 1 Year Backend Dev
GitHub: github.com/ananya-dev | Email: ananya.iyer@gmail.com

TECHNICAL SKILLS:
• Backend & Data: Python, R, Node.js, PostgreSQL, Redis, Pandas, REST APIs
• DevOps & Cloud: Docker, Kubernetes, AWS (S3, EC2, Lambda), Linux/Bash, CI/CD GitHub Actions
• Data Science: Data visualization with Plotly/Matplotlib, matrix normalization, exploratory data analysis

WORK & PROJECT EXPERIENCE:
1. Automated Cloud Data Ingestion & Analytics Pipeline
   • Architected containerized ETL pipeline using Docker and AWS S3 handling 50GB multi-dimensional CSV matrices.
   • Created interactive dashboard visualizing cluster distributions with 2D dimensionality reduction (PCA).
2. Genomic File Parser Web API
   • Built FastAPI microservice for validating FASTA format headers and calculating GC content percentages for research teams.`
  }
];
