type SanityFetcher = <T = unknown>(
  query: string,
  params?: Record<string, unknown>
) => Promise<T>;

type ReferenceDoc = {
  _type?: string;
  slug?: string | null;
};

export type PortableMarkDef = {
  _type?: string;
  reference?: { _ref?: string } | null;
  note?: PortableBlock[] | null;
  [property: string]: unknown;
};

export type PortableBlock = {
  markDefs?: PortableMarkDef[];
  content?: PortableBlock[];
  details?: PortableBlock[];
  [property: string]: unknown;
};

export type PortableTimelineRecord = {
  details?: PortableBlock[];
  [property: string]: unknown;
};

export type PortablePageBlock = {
  category?: string;
  records?: PortableTimelineRecord[];
  content?: PortableBlock[];
  [property: string]: unknown;
};

function isPortableMarkDefArray(value: unknown): value is PortableMarkDef[] {
  return Array.isArray(value);
}

function isPortableBlockArray(value: unknown): value is PortableBlock[] {
  return Array.isArray(value);
}

function isPortableTimelineRecordArray(
  value: unknown
): value is PortableTimelineRecord[] {
  return Array.isArray(value);
}

export function createPortableTextProcessor(client: { fetch: SanityFetcher }) {
  const referenceCache = new Map<string, ReferenceDoc | null>();

  async function fetchReferenceData(refId: string) {
    if (!refId) return null;
    if (referenceCache.has(refId)) {
      return referenceCache.get(refId) ?? null;
    }
    const refDoc = await client.fetch<ReferenceDoc>(
      `*[_id == $ref][0]{ _type, "slug": slug.current }`,
      { ref: refId }
    );
    referenceCache.set(refId, refDoc ?? null);
    return refDoc ?? null;
  }

  async function resolveMarkDefs(
    markDefs: PortableMarkDef[] | undefined
  ): Promise<PortableMarkDef[] | undefined> {
    if (!isPortableMarkDefArray(markDefs)) return markDefs;
    const processedMarkDefs = await Promise.all(
      markDefs.map(async (markDef) => {
        if (!markDef || typeof markDef !== "object") return markDef;

        let updatedMarkDef: PortableMarkDef = { ...markDef };

        if (
          markDef._type === "internalLink" &&
          markDef.reference &&
          markDef.reference._ref
        ) {
          const refDoc = await fetchReferenceData(markDef.reference._ref);
          updatedMarkDef = {
            ...updatedMarkDef,
            refType: refDoc?._type,
            refSlug: refDoc?.slug ?? undefined,
          };
        }

        if (isPortableBlockArray(markDef.note)) {
          const processedNote = await processPortableBlocks(markDef.note);
          updatedMarkDef = {
            ...updatedMarkDef,
            note: processedNote,
          };
        }

        return updatedMarkDef;
      })
    );

    return processedMarkDefs;
  }

  async function processPortableBlock(
    block: PortableBlock | undefined
  ): Promise<PortableBlock | undefined> {
    if (!block || typeof block !== "object") return block;

    let updatedBlock: PortableBlock = { ...block };

    if (isPortableMarkDefArray(block.markDefs)) {
      const processedMarkDefs = await resolveMarkDefs(block.markDefs);
      updatedBlock = {
        ...updatedBlock,
        markDefs: processedMarkDefs,
      };
    }

    if (isPortableBlockArray(block.content)) {
      const processedContent = await processPortableBlocks(block.content);
      updatedBlock = {
        ...updatedBlock,
        content: processedContent,
      };
    }

    if (isPortableBlockArray(block.details)) {
      const processedDetails = await processPortableBlocks(block.details);
      updatedBlock = {
        ...updatedBlock,
        details: processedDetails,
      };
    }

    return updatedBlock;
  }

  async function processPortableBlocks(
    blocks: PortableBlock[] | undefined
  ): Promise<PortableBlock[] | undefined> {
    if (!isPortableBlockArray(blocks)) return blocks;
    const processedBlocks = await Promise.all(
      blocks.map((block) => processPortableBlock(block))
    );
    return processedBlocks as PortableBlock[];
  }

  async function processTimelineRecords(
    records: PortableTimelineRecord[] | undefined
  ): Promise<PortableTimelineRecord[] | undefined> {
    if (!isPortableTimelineRecordArray(records)) return records;
    const processedRecords = await Promise.all(
      records.map(async (record) => {
        if (!record || typeof record !== "object") return record;
        if (!isPortableBlockArray(record.details)) return record;
        const processedDetails = await processPortableBlocks(record.details);
        return { ...record, details: processedDetails };
      })
    );
    return processedRecords as PortableTimelineRecord[];
  }

  async function processPageBlocks(
    blocks: PortablePageBlock[] | undefined
  ): Promise<PortablePageBlock[] | undefined> {
    if (!Array.isArray(blocks)) return blocks;
    const processedBlocks = await Promise.all(
      blocks.map(async (block) => {
        if (!block || typeof block !== "object") return block;

        if (
          block.category === "timeline" &&
          isPortableTimelineRecordArray(block.records)
        ) {
          const processedRecords = await processTimelineRecords(block.records);
          return { ...block, records: processedRecords };
        }

        if (
          block.category === "content" &&
          isPortableBlockArray(block.content)
        ) {
          const processedContent = await processPortableBlocks(block.content);
          return { ...block, content: processedContent };
        }

        return block;
      })
    );
    return processedBlocks as PortablePageBlock[];
  }

  return {
    processPortableBlocks,
    processPageBlocks,
  };
}

