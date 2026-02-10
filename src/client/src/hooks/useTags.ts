/*
 * useTags — Fetch tags from backend API with fallback to constants
 */
import { useState, useEffect } from "react";
import { getTags } from "@/lib/api";
import { TAGS as DEFAULT_TAGS } from "@/lib/constants";

export function useTags() {
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTags()
      .then((data) => {
        if (data && data.length > 0) setTags(data);
      })
      .catch(() => {
        // fallback to default tags
      })
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading };
}
