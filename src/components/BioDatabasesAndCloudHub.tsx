import React, { useState } from 'react';
import {
  Database,
  Cloud,
  Server,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  HardDrive,
  Table,
  Filter,
  CheckCircle2,
  FileCode2,
  BookmarkCheck,
  ShieldCheck
} from 'lucide-react';

interface BioDatabasesAndCloudHubProps {
  onNavigateToRoadmap?: () => void;
  onNavigateToInterview?: () => void;
}

export const BIO_DATABASES_LIST = [
  {
    id: 'ncbi_entrez',
    name: 'NCBI Entrez (E-Utilities)',
    org: 'National Center for Biotechnology Information (USA)',
    type: 'REST / XML / JSON API',
    category: 'Sequences & Literature',
    description: 'The primary central repository for biomedical data. E-Utilities (esearch, efetch, esummary) programmatically queries PubMed, GenBank, dbSNP, and SRA.',
    pythonLibrary: 'Bio.Entrez (Biopython) / requests',
    keyDatabases: ['PubMed (Literature)', 'Nucleotide / GenBank', 'SRA (Raw FASTQ reads)', 'dbSNP (Single Nucleotide Polymorphisms)'],
    documentationUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK25501/',
    rateLimits: '3 requests/sec without API key; 10 requests/sec with free NCBI API Key',
    sampleSnippet: `from Bio import Entrez
import json

# Set email as required by NCBI policy
Entrez.email = "cs_student@university.ac.in"
Entrez.tool = "BioInfoBridgeApp"

# 1. Search PubMed for latest CRISPR oncology clinical trials
handle = Entrez.esearch(db="pubmed", term="CRISPR Cas9 immunotherapy cancer[Title/Abstract]", retmax=5, sort="pub_date")
record = Entrez.read(handle)
handle.close()
pubmed_ids = record["IdList"]
print("Matching PubMed IDs:", pubmed_ids)

# 2. Fetch summary details for the top article
summary_handle = Entrez.esummary(db="pubmed", id=",".join(pubmed_ids[:3]))
summaries = Entrez.read(summary_handle)
summary_handle.close()

for article in summaries:
    print(f"Title: {article['Title']}")
    print(f"Journal: {article['Source']} | PubDate: {article['PubDate']}\\n")`
  },
  {
    id: 'ensembl_rest',
    name: 'Ensembl REST API',
    org: 'EMBL-EBI & Wellcome Sanger Institute (UK)',
    type: 'JSON REST API',
    category: 'Genomic Annotations & Variants',
    description: 'High-speed REST API for retrieving vertebrate genomes, gene models, transcript isoforms, GRCh38 chromosomal coordinates, and VEP (Variant Effect Predictor) annotations.',
    pythonLibrary: 'requests / pyensembl',
    keyDatabases: ['Human GRCh38 / GRCh37', 'Ensembl Genes & Transcripts', 'VEP (Variant Consequences)', 'Homology & Orthologs'],
    documentationUrl: 'https://rest.ensembl.org/',
    rateLimits: '15 requests/sec burst rate. Supports batch POST endpoints (up to 1,000 items/request)',
    sampleSnippet: `import requests
import json

server = "https://rest.ensembl.org"

# 1. Lookup human gene coordinates (e.g., TP53)
endpoint = "/lookup/symbol/homo_sapiens/TP53?expand=1"
response = requests.get(server + endpoint, headers={"Content-Type": "application/json"})

if response.ok:
    gene = response.json()
    print(f"Gene: {gene['display_name']} ({gene['id']})")
    print(f"Location: Chromosome {gene['seq_region_name']}:{gene['start']}-{gene['end']} (Strand: {gene['strand']})")
    print(f"Biotype: {gene['biotype']} | Number of Transcripts: {len(gene.get('Transcript', []))}")

# 2. Query Variant Effect Prediction for a single nucleotide substitution
variant_endpoint = "/vep/human/hgvs/9:g.22125503G>C?"
vep_res = requests.get(server + variant_endpoint, headers={"Content-Type": "application/json"})
if vep_res.ok:
    consequences = vep_res.json()
    print("Most severe consequence:", consequences[0].get("most_severe_consequence"))`
  },
  {
    id: 'uniprot_pdb',
    name: 'UniProt & RCSB Protein Data Bank (PDB)',
    org: 'UniProt Consortium & RCSB PDB',
    type: 'REST & GraphQL API',
    category: 'Protein Structures & Functional Domains',
    description: 'The world reference database for protein sequence, function, catalytic active sites, post-translational modifications, and atomic 3D coordinates (PDB/AlphaFold models).',
    pythonLibrary: 'requests / Bio.PDB / biotite',
    keyDatabases: ['UniProtKB/Swiss-Prot (Curated)', 'RCSB PDB (X-ray/Cryo-EM structures)', 'AlphaFold Protein Structure Database'],
    documentationUrl: 'https://www.uniprot.org/help/api',
    rateLimits: 'Generous public API, automated pagination with TSV/JSON formats',
    sampleSnippet: `import requests

# 1. Retrieve curated Swiss-Prot record for human EGFR kinase
uniprot_id = "P00533" # EGFR
url = f"https://rest.uniprot.org/uniprotkb/{uniprot_id}.json"
res = requests.get(url)
data = res.json()

protein_name = data["proteinDescription"]["recommendedName"]["fullName"]["value"]
organism = data["organism"]["scientificName"]
length = data["sequence"]["length"]
print(f"Protein: {protein_name} ({organism}) - {length} amino acids")

# 2. Download 3D AlphaFold predicted coordinate file (.pdb format)
alphafold_url = f"https://alphafold.ebi.ac.uk/files/AF-{uniprot_id}-F1-model_v4.pdb"
pdb_response = requests.get(alphafold_url)
if pdb_response.ok:
    # Save coordinate file for PyMOL, ChimeraX, or PyTorch Geometric
    with open(f"AF_{uniprot_id}.pdb", "w") as f:
        f.write(pdb_response.text[:1000]) # First 1000 chars preview
    print(f"Saved AlphaFold 3D structure for {uniprot_id}")`
  },
  {
    id: 'clinvar_gnomad',
    name: 'ClinVar & gnomAD (Genome Aggregation Database)',
    org: 'NCBI & Broad Institute of MIT and Harvard',
    type: 'BigQuery / Parquet / REST',
    category: 'Clinical Genetics & Population Frequencies',
    description: 'Gold-standard resources for clinical mutation pathogenicity (ClinVar) and global population allele frequencies across 140,000+ exomes and genomes (gnomAD). Essential for filtering benign mutations.',
    pythonLibrary: 'DuckDB / Google BigQuery / requests',
    keyDatabases: ['ClinVar Pathogenicity (Benign -> Pathogenic)', 'gnomAD Allele Frequency (AF_popmax)', 'Broad Institute AWS Public Dataset'],
    documentationUrl: 'https://gnomad.broadinstitute.org/downloads',
    rateLimits: 'Public Amazon S3 / Google Cloud Storage buckets & GraphQL API',
    sampleSnippet: `import duckdb

# Query public gnomAD / ClinVar variant data with DuckDB
# Filtering rare pathogenic mutations without downloading entire 50GB file
con = duckdb.connect()

query = """
SELECT 
    chrom, 
    pos, 
    ref, 
    alt, 
    gene_symbol,
    clinical_significance,
    review_status,
    allele_frequency_gnomad
FROM read_parquet('s3://public-genomics-data/clinvar_curated_grch38.parquet')
WHERE gene_symbol IN ('BRCA1', 'BRCA2', 'PALB2')
  AND clinical_significance ILIKE '%Pathogenic%'
  AND allele_frequency_gnomad < 0.001 -- Rare disease variant filter
ORDER BY chrom, pos
LIMIT 10;
"""
print("DuckDB query executed in ~150ms with columnar predicate pushdown")`
  },
  {
    id: 'tcga_gdc',
    name: 'TCGA (The Cancer Genome Atlas) / GDC API',
    org: 'National Cancer Institute (NCI GDC)',
    type: 'REST API & Python SDK',
    category: 'Cancer Cohorts & Multi-Omics',
    description: 'Comprehensive multi-omics profiles (RNA-seq, somatic mutations, copy number, clinical survival times) across 33 human cancer types and 20,000+ primary tumor patient samples.',
    pythonLibrary: 'requests / gdc-client / TCGAbiolinks (R)',
    keyDatabases: ['TCGA-LUAD (Lung)', 'TCGA-BRCA (Breast)', 'TCGA-GBM (Glioblastoma)', 'Clinical Survival Endpoints'],
    documentationUrl: 'https://gdc.cancer.gov/developers/gdc-application-programming-interface-api',
    rateLimits: 'Open access for unmasked RNA-seq & clinical metadata',
    sampleSnippet: `import requests
import json

# GDC REST API: Query clinical patient demographics and survival for TCGA-BRCA
endpoint = "https://api.gdc.cancer.gov/cases"

filters = {
    "op": "and",
    "content": [
        {
            "op": "in",
            "content": {
                "field": "project.project_id",
                "value": ["TCGA-BRCA"]
            }
        }
    ]
}

params = {
    "filters": json.dumps(filters),
    "fields": "submitter_id,diagnoses.age_at_diagnosis,diagnoses.vital_status,diagnoses.days_to_death",
    "format": "JSON",
    "size": "5"
}

res = requests.get(endpoint, params=params)
cases = res.json()["data"]["hits"]
for c in cases:
    diag = c["diagnoses"][0] if c.get("diagnoses") else {}
    print(f"Patient ID: {c['submitter_id']} | Vital Status: {diag.get('vital_status')} | Age: {diag.get('age_at_diagnosis')}")`
  }
];

export const CLOUD_GENOMICS_BLUEPRINTS = [
  {
    id: 'aws_batch_nextflow',
    title: 'AWS Life Sciences: Nextflow on AWS Batch & S3',
    cloud: 'Amazon Web Services (AWS)',
    tag: 'Industry Standard NGS Architecture',
    description: 'Decoupled, containerized bioinformatics pipelines executing on Spot EC2 instances for 65-75% compute cost reduction.',
    components: [
      { name: 'Amazon S3', role: 'Object storage for FASTQ reads, reference FASTA, BAM alignments, and Nextflow intermediate work directory.' },
      { name: 'AWS Batch', role: 'Managed compute environment that dynamically provisions autoscaling EC2 spot instances based on queue load.' },
      { name: 'Amazon ECR / Docker Hub', role: 'Stores containerized images for each bioinformatics step (e.g. bwa:0.7.17, samtools:1.18, gatk:4.4).' },
      { name: 'Nextflow AWS Executor', role: 'Orchestrates DAG execution, handles automatic job retries on spot preemption, and streams outputs to S3.' }
    ],
    configSnippet: `// nextflow.config - AWS Batch Production Profile
profiles {
    awsbatch {
        process.executor = 'awsbatch'
        process.queue = 'arn:aws:batch:ap-south-1:123456789012:job-queue/genomics-spot-queue'
        aws.region = 'ap-south-1' // AWS Mumbai region
        aws.batch.cliPath = '/home/ec2-user/miniconda/bin/aws'
        
        // Work directory in S3
        workDir = 's3://my-genomics-bucket/work/'
        
        // Container runtime
        docker.enabled = true
        
        process {
            withName: 'ALIGN_BWA' {
                container = 'quay.io/biocontainers/bwa:0.7.17'
                cpus = 8
                memory = '32 GB'
            }
            withName: 'CALL_VARIANTS_GATK' {
                container = 'broadinstitute/gatk:4.4.0.0'
                cpus = 4
                memory = '16 GB'
            }
        }
    }
}`
  },
  {
    id: 'gcp_bigquery_genomics',
    title: 'Google Cloud Platform: BigQuery & 1000 Genomes Analytics',
    cloud: 'Google Cloud Platform (GCP)',
    tag: 'Serverless Petabyte-Scale Variant SQL',
    description: 'Querying billions of genomic variants in public datasets (1000 Genomes, gnomAD, ClinVar) with standard SQL in seconds.',
    components: [
      { name: 'Google Cloud BigQuery', role: 'Serverless columnar data warehouse querying multi-terabyte genomic variant tables with SQL.' },
      { name: 'Cloud Storage (GCS)', role: 'Genomic bucket storage supporting requester-pays public datasets.' },
      { name: 'Google Cloud Life Sciences API', role: 'Runs containerized pipelines (dsub / Cromwell / Nextflow GCP runner).' }
    ],
    configSnippet: `-- BigQuery SQL: Find high-frequency pathogenic mutations in Indian population cohorts
SELECT
  reference_name AS chromosome,
  start_position,
  end_position,
  reference_bases,
  alternate_bases[OFFSET(0)] AS alt_allele,
  ROUND(allele_count / total_allele_count, 4) AS allele_frequency,
  clinvar.clinical_significance
FROM
  \`bigquery-public-data.human_genome_variants.1000_genomes_phase_3\` AS variants
LEFT JOIN
  \`bigquery-public-data.human_genome_variants.clinvar_variants\` AS clinvar
ON
  variants.reference_name = clinvar.chromosome
  AND variants.start_position = clinvar.position
WHERE
  reference_name IN ('13', '17') -- BRCA1 (Chr 17) & BRCA2 (Chr 13)
  AND clinvar.clinical_significance LIKE '%Pathogenic%'
  AND allele_count > 0
ORDER BY
  chromosome, start_position
LIMIT 25;`
  },
  {
    id: 'duckdb_parquet_fastapi',
    title: 'Modern In-Memory Bio-Data Engine: DuckDB & Apache Parquet',
    cloud: 'Hybrid Cloud / Local Edge',
    tag: 'Ultra-Fast Zero-Server Variant Queries',
    description: 'Replaces heavy relational database instances by running SIMD-accelerated SQL queries directly on compressed Parquet files stored in S3/Cloud Storage.',
    components: [
      { name: 'Apache Parquet', role: 'Columnar storage format with Snappy compression, encoding 50M rows into <1.5GB.' },
      { name: 'DuckDB Engine', role: 'In-process analytical SQL engine with projection pushdown, predicate pushdown, and zero RAM blowup.' },
      { name: 'FastAPI / Streamlit', role: 'Web API or dashboard querying variant data in <50ms without keeping a live Postgres database running.' }
    ],
    configSnippet: `import duckdb
from fastapi import FastAPI, Query

app = FastAPI(title="High-Speed Variant Search API")
con = duckdb.connect()

# Enable S3 direct reading extension
con.execute("INSTALL httpfs; LOAD httpfs;")
con.execute("SET s3_region='ap-south-1';")

@app.get("/api/variants/search")
def search_genomic_variants(
    chrom: str = Query("chr17", description="Chromosome"),
    start: int = Query(41196312, description="Start base"),
    end: int = Query(41277500, description="End base")
):
    # Vectorized SQL execution with predicate pushdown directly on S3 Parquet
    query = """
        SELECT chrom, pos, ref, alt, gene_symbol, consequence, allele_freq
        FROM read_parquet('s3://my-genomics-bucket/annotated_variants.parquet')
        WHERE chrom = $1 AND pos >= $2 AND pos <= $3
        ORDER BY pos
        LIMIT 100;
    """
    df = con.execute(query, [chrom, start, end]).fetchdf()
    return {"count": len(df), "variants": df.to_dict(orient="records")}`
  },
  {
    id: 'relational_postgres_schema',
    title: 'Relational Genomics Architecture: PostgreSQL DDL & Spatial Indexing',
    cloud: 'PostgreSQL / Supabase / AWS RDS',
    tag: 'Clinical Laboratory LIMS & Sample DB',
    description: 'Optimized relational schema for clinical sequencing laboratories managing patients, NGS runs, sample QC, and called variants with B-Tree composite indexing.',
    components: [
      { name: 'Patients & Cohorts Table', role: 'Demographics, clinical phenotypes (HPO terms), and consent flags.' },
      { name: 'Sequencing Runs Table', role: 'Flowcell ID, sequencer model (NovaSeq/NextSeq), mean coverage, and Q30 score.' },
      { name: 'Called Variants Table', role: 'Genomic coordinates with (chrom, pos_start, pos_end) composite indexing for instant range queries.' }
    ],
    configSnippet: `-- Production PostgreSQL Schema for Clinical NGS LIMS
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_number VARCHAR(64) UNIQUE NOT NULL,
    age_at_sampling INTEGER CHECK (age_at_sampling >= 0),
    phenotype_hpo_terms TEXT[], -- e.g. ['HP:0001250', 'HP:0002011']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sequencing_samples (
    sample_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    sample_barcode VARCHAR(64) UNIQUE NOT NULL,
    tissue_type VARCHAR(32) NOT NULL, -- 'Blood', 'FFPE Tumor', 'Saliva'
    mean_target_coverage NUMERIC(6,2), -- e.g. 120.50x
    q30_percentage NUMERIC(5,2) CHECK (q30_percentage BETWEEN 0 AND 100)
);

CREATE TABLE genomic_variants (
    variant_id BIGSERIAL PRIMARY KEY,
    sample_id UUID REFERENCES sequencing_samples(sample_id) ON DELETE CASCADE,
    chrom VARCHAR(8) NOT NULL, -- 'chr1', 'chrX'
    pos_start INTEGER NOT NULL,
    pos_end INTEGER NOT NULL,
    ref_allele VARCHAR(255) NOT NULL,
    alt_allele VARCHAR(255) NOT NULL,
    gene_symbol VARCHAR(32),
    clinical_significance VARCHAR(64), -- 'Pathogenic', 'Likely Pathogenic', 'VUS'
    allele_fraction NUMERIC(5,4) -- Variant Allele Fraction (VAF: 0.0000 - 1.0000)
);

-- CRITICAL PERFORMANCE INDEXES FOR GENOMIC RANGE LOOKUPS
CREATE INDEX idx_variants_coords ON genomic_variants (chrom, pos_start, pos_end);
CREATE INDEX idx_variants_gene ON genomic_variants (gene_symbol);
CREATE INDEX idx_variants_significance ON genomic_variants (clinical_significance);`
  }
];

export const BioDatabasesAndCloudHub: React.FC<BioDatabasesAndCloudHubProps> = ({
  onNavigateToRoadmap,
  onNavigateToInterview
}) => {
  const [activeTab, setActiveTab] = useState<'databases' | 'cloud'>('databases');
  const [selectedDbId, setSelectedDbId] = useState<string>(BIO_DATABASES_LIST[0].id);
  const [selectedCloudId, setSelectedCloudId] = useState<string>(CLOUD_GENOMICS_BLUEPRINTS[0].id);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const selectedDb = BIO_DATABASES_LIST.find(d => d.id === selectedDbId) || BIO_DATABASES_LIST[0];
  const selectedCloud = CLOUD_GENOMICS_BLUEPRINTS.find(c => c.id === selectedCloudId) || CLOUD_GENOMICS_BLUEPRINTS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-3">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Bioinformatics Data Engineering & Cloud Infrastructure</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Biological Databases, REST APIs & Cloud Genomics
            </h2>
            <p className="mt-1.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Master how modern computational biologists interact with petabyte-scale biological repositories (NCBI Entrez, Ensembl REST, UniProt, ClinVar, TCGA) and build autoscaling cloud pipelines on AWS Batch, Google BigQuery, and DuckDB.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('databases')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'databases'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Biological Databases (5)</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cloud'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud & SQL Blueprints (4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BIOLOGICAL DATABASES CATALOG & CODE PLAYGROUND */}
      {/* ========================================================================= */}
      {activeTab === 'databases' && (
        <div className="space-y-6">
          {/* Databases Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {BIO_DATABASES_LIST.map((db) => {
              const isSelected = selectedDbId === db.id;
              return (
                <div
                  key={db.id}
                  onClick={() => setSelectedDbId(db.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {db.category.split('&')[0]}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-2 line-clamp-1">{db.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {db.org}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold">
                    <span>{db.type}</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Database Card & Interactive Code Walkthrough */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Database className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedDb.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    {selectedDb.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{selectedDb.org}</p>
                <p className="text-xs text-slate-700 max-w-3xl leading-relaxed mt-1">
                  {selectedDb.description}
                </p>
              </div>

              <a
                href={selectedDb.documentationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metadata & Key Databases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" /> Recommended Client / Library:
                </div>
                <code className="text-[11px] text-blue-800 font-mono font-semibold block">
                  {selectedDb.pythonLibrary}
                </code>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Rate Limits & Authentication:
                </div>
                <div className="text-[11px] text-slate-700">
                  {selectedDb.rateLimits}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-purple-600" /> Core Datasets Available:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedDb.keyDatabases.map((k, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Production Python / Query Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  Production Python Script (Copy & Run):
                </label>

                <button
                  onClick={() => handleCopy(selectedDb.sampleSnippet, selectedDb.id)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCodeKey === selectedDb.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
                <pre className="leading-relaxed">
                  <code>{selectedDb.sampleSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLOUD GENOMICS & BIG DATA ARCHITECTURES */}
      {/* ========================================================================= */}
      {activeTab === 'cloud' && (
        <div className="space-y-6">
          {/* Cloud Blueprints Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CLOUD_GENOMICS_BLUEPRINTS.map((cloud) => {
              const isSelected = selectedCloudId === cloud.id;
              return (
                <div
                  key={cloud.id}
                  onClick={() => setSelectedCloudId(cloud.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {cloud.cloud.split(' ')[0]}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-2 line-clamp-2">{cloud.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {cloud.tag}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold">
                    <span>View Architecture</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Cloud Blueprint Deep Dive */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Cloud className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedCloud.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                  {selectedCloud.cloud}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                {selectedCloud.description}
              </p>
            </div>

            {/* Architecture Components Grid */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" /> Core Architectural Building Blocks:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCloud.components.map((comp, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{comp.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                      {comp.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud Configuration / Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  Configuration / Implementation Code:
                </label>

                <button
                  onClick={() => handleCopy(selectedCloud.configSnippet, selectedCloud.id)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCodeKey === selectedCloud.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
                <pre className="leading-relaxed">
                  <code>{selectedCloud.configSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Practical Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                These cloud blueprints are frequently tested in technical screening rounds at Strand Life Sciences & MedGenome.
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToInterview && (
                  <button
                    onClick={onNavigateToInterview}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Practice Cloud Questions in Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
