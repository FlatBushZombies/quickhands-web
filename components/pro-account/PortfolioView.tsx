"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { PageTitle } from "@/components/pro-account/ProAccountViews"
import { css, Divider, Field, G, Ico, inputBase, Ix, Modal, ModalHeader, Tag } from "@/components/pro-account/ui"
import { getMyBioSettings } from "@/lib/bio-api-client"
import { uploadToCloudinary } from "@/lib/cloudinary"
import {
  addPortfolioMedia,
  createPortfolioProject,
  deletePortfolioProject,
  getMyPortfolio,
  removePortfolioMedia,
  reorderPortfolioProjects,
  updatePortfolioProject,
  type PortfolioProject,
} from "@/lib/portfolio-api"

const CAPTION = "font:var(--text-micro);letter-spacing:var(--ls-mono);text-transform:uppercase;color:var(--fg-3)"
const CARD = "padding:28px;border-radius:var(--radius-xl);background:var(--white);box-shadow:var(--shadow-hairline)"

type Draft = { title: string; category: string; skills: string; description: string; projectUrl: string }
const EMPTY_DRAFT: Draft = { title: "", category: "", skills: "", description: "", projectUrl: "" }

function draftFrom(project: PortfolioProject): Draft {
  return {
    title: project.title,
    category: project.category ?? "",
    skills: project.skills ?? "",
    description: project.description ?? "",
    projectUrl: project.projectUrl ?? "",
  }
}

function splitSkills(skills: string | null) {
  return (skills ?? "")
    .split(/[,;|\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * The specialist's shareable portfolio: add/edit/delete/reorder projects and
 * their photos. Backed by the same GET/POST/PATCH/DELETE /api/portfolio/*
 * endpoints the public bio page (/[username]) already renders from — so
 * anything saved here shows up on that real, shareable public link.
 */
export function PortfolioView({ onGoSettings }: { onGoSettings?: () => void }) {
  const { getToken } = useAuth()

  const [projects, setProjects] = useState<PortfolioProject[] | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [usernameLoaded, setUsernameLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modal, setModal] = useState<{ kind: "add" } | { kind: "edit"; project: PortfolioProject } | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  const [busyId, setBusyId] = useState<number | null>(null)
  const [rowError, setRowError] = useState<Record<number, string>>({})
  const [copied, setCopied] = useState(false)

  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => {
    let active = true
    ;(async () => {
      const token = await getToken()
      if (!token || !active) return
      try {
        const [list, bio] = await Promise.all([getMyPortfolio(token), getMyBioSettings(token).catch(() => null)])
        if (!active) return
        setProjects(list)
        setUsername(bio?.username ?? null)
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "Failed to load your portfolio")
      } finally {
        if (active) setUsernameLoaded(true)
      }
    })()
    return () => {
      active = false
    }
  }, [getToken])

  const portfolioUrl = username && typeof window !== "undefined" ? `${window.location.origin}/${username}` : null

  async function copyLink() {
    if (!portfolioUrl) return
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable — nothing more we can do silently.
    }
  }

  function openAdd() {
    setDraft(EMPTY_DRAFT)
    setModalError(null)
    setModal({ kind: "add" })
  }
  function openEdit(project: PortfolioProject) {
    setDraft(draftFrom(project))
    setModalError(null)
    setModal({ kind: "edit", project })
  }

  async function saveDraft() {
    if (!draft.title.trim()) {
      setModalError("Give the project a title")
      return
    }
    setSaving(true)
    setModalError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")

      const payload = {
        title: draft.title.trim(),
        category: draft.category.trim() || undefined,
        skills: draft.skills.trim() || undefined,
        description: draft.description.trim() || undefined,
        projectUrl: draft.projectUrl.trim() || undefined,
      }

      if (modal?.kind === "edit") {
        const updated = await updatePortfolioProject(modal.project.id, payload, token)
        setProjects((prev) => (prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : prev))
      } else {
        const created = await createPortfolioProject(payload, token)
        setProjects((prev) => [...(prev ?? []), created])
      }
      setModal(null)
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Failed to save project")
    } finally {
      setSaving(false)
    }
  }

  async function removeProject(project: PortfolioProject) {
    setBusyId(project.id)
    setRowError((prev) => ({ ...prev, [project.id]: "" }))
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")
      await deletePortfolioProject(project.id, token)
      setProjects((prev) => (prev ? prev.filter((p) => p.id !== project.id) : prev))
    } catch (error) {
      setRowError((prev) => ({ ...prev, [project.id]: error instanceof Error ? error.message : "Failed to delete" }))
    } finally {
      setBusyId(null)
    }
  }

  async function move(project: PortfolioProject, direction: -1 | 1) {
    if (!projects) return
    const ordered = [...projects].sort((a, b) => a.sortOrder - b.sortOrder)
    const index = ordered.findIndex((p) => p.id === project.id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= ordered.length) return

    const swapped = [...ordered]
    ;[swapped[index], swapped[target]] = [swapped[target], swapped[index]]

    setBusyId(project.id)
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")
      const reordered = await reorderPortfolioProjects(swapped.map((p) => p.id), token)
      setProjects(reordered)
    } catch (error) {
      setRowError((prev) => ({ ...prev, [project.id]: error instanceof Error ? error.message : "Failed to reorder" }))
    } finally {
      setBusyId(null)
    }
  }

  async function uploadPhoto(project: PortfolioProject, file: File) {
    setBusyId(project.id)
    setRowError((prev) => ({ ...prev, [project.id]: "" }))
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")
      const { url } = await uploadToCloudinary(file, { resourceType: "image" })
      const media = await addPortfolioMedia(project.id, url, token)
      setProjects((prev) =>
        prev ? prev.map((p) => (p.id === project.id ? { ...p, media: [...p.media, media] } : p)) : prev
      )
    } catch (error) {
      setRowError((prev) => ({ ...prev, [project.id]: error instanceof Error ? error.message : "Failed to upload photo" }))
    } finally {
      setBusyId(null)
    }
  }

  async function removePhoto(project: PortfolioProject, mediaId: number) {
    setBusyId(project.id)
    try {
      const token = await getToken()
      if (!token) throw new Error("Couldn't verify your session. Please sign in again.")
      await removePortfolioMedia(mediaId, token)
      setProjects((prev) =>
        prev ? prev.map((p) => (p.id === project.id ? { ...p, media: p.media.filter((m) => m.id !== mediaId) } : p)) : prev
      )
    } catch (error) {
      setRowError((prev) => ({ ...prev, [project.id]: error instanceof Error ? error.message : "Failed to remove photo" }))
    } finally {
      setBusyId(null)
    }
  }

  const ordered = projects ? [...projects].sort((a, b) => a.sortOrder - b.sortOrder) : null

  return (
    <div style={css("display:flex;flex-direction:column;gap:24px")}>
      <div style={css("display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
        <PageTitle eyebrow="Shareable with clients" title="Your" em="portfolio" after="." />
        <Ix
          onClick={openAdd}
          base={`display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer`}
          hover="opacity:.92"
        >
          <Ico name="plus" size={16} />
          Add project
        </Ix>
      </div>

      <div style={css(CARD)}>
        <span style={css(CAPTION)}>Your public link</span>
        {!usernameLoaded ? (
          <div style={css("height:44px;border-radius:var(--radius-md);background:var(--ink-100);margin-top:14px")} aria-hidden="true" />
        ) : portfolioUrl ? (
          <div style={css("display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap")}>
            <span style={{ ...inputBase, display: "flex", alignItems: "center", flex: "1 1 240px", color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {portfolioUrl}
            </span>
            <Ix
              onClick={copyLink}
              base="display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:0;border-radius:999px;background:var(--white);box-shadow:inset 0 0 0 1px var(--border-default);font:500 14px/1 var(--font-sans);color:var(--fg-1);cursor:pointer"
              hover="background:var(--ink-100)"
            >
              <Ico name={copied ? "check" : "copy"} size={15} style={copied ? `color:${G}` : ""} />
              {copied ? "Copied" : "Copy link"}
            </Ix>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              style={css("display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:999px;background:var(--ink-50);font:500 14px/1 var(--font-sans);color:var(--fg-1);text-decoration:none")}
            >
              <Ico name="external-link" size={15} />
              View
            </a>
          </div>
        ) : (
          <div style={css("display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:14px;flex-wrap:wrap")}>
            <p style={css("margin:0;color:var(--fg-2)")}>Set a public username in Settings to get a shareable link to this portfolio.</p>
            {onGoSettings ? (
              <button
                type="button"
                onClick={onGoSettings}
                style={css(`border:0;background:transparent;padding:0;font:500 14px/1 var(--font-sans);color:${G};cursor:pointer;white-space:nowrap`)}
              >
                Go to Settings →
              </button>
            ) : (
              <a href="/settings" style={css(`font:500 14px/1 var(--font-sans);color:${G};text-decoration:none;white-space:nowrap`)}>
                Go to Settings →
              </a>
            )}
          </div>
        )}
      </div>

      {loadError ? (
        <div style={css(CARD)}>
          <p style={css("margin:0;color:#B42318")}>{loadError}</p>
        </div>
      ) : ordered === null ? (
        <div style={css("height:200px;border-radius:var(--radius-xl);background:var(--ink-100)")} aria-hidden="true" />
      ) : ordered.length === 0 ? (
        <div style={css(`${CARD};text-align:center;padding:48px 28px`)}>
          <Ico name="image" size={28} style="color:var(--fg-3)" />
          <h3 style={css("margin:16px 0 0;font:500 18px/1.3 var(--font-sans)")}>No projects yet</h3>
          <p style={css("margin:8px 0 0;color:var(--fg-2)")}>Add your best work so clients know what to expect before they hire you.</p>
        </div>
      ) : (
        <div style={css("display:flex;flex-direction:column;gap:16px")}>
          {ordered.map((project, index) => {
            const skills = splitSkills(project.skills)
            const busy = busyId === project.id
            return (
              <div key={project.id} style={css(CARD)}>
                <div style={css("display:flex;align-items:flex-start;justify-content:space-between;gap:16px")}>
                  <div style={css("min-width:0")}>
                    <div style={css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h3 style={css("margin:0;font:500 18px/1.3 var(--font-sans)")}>{project.title}</h3>
                      {project.category ? <Tag>{project.category}</Tag> : null}
                    </div>
                    {project.description ? (
                      <p style={css("margin:10px 0 0;color:var(--fg-2);text-wrap:pretty")}>{project.description}</p>
                    ) : null}
                    {skills.length > 0 ? (
                      <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:12px")}>
                        {skills.map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                    ) : null}
                    {project.projectUrl ? (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={css(`display:inline-flex;align-items:center;gap:6px;margin-top:12px;font:500 13px/1 var(--font-sans);color:${G};text-decoration:none`)}
                      >
                        <Ico name="external-link" size={13} />
                        {project.projectUrl}
                      </a>
                    ) : null}
                  </div>

                  <div style={css("display:flex;align-items:center;gap:4px;flex-shrink:0")}>
                    <Ix
                      aria-label="Move up"
                      onClick={() => move(project, -1)}
                      base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
                      hover="background:var(--ink-100);color:var(--fg-1)"
                      style={index === 0 || busy ? { opacity: 0.35, pointerEvents: "none" } : undefined}
                    >
                      <Ico name="chevron-up" size={15} />
                    </Ix>
                    <Ix
                      aria-label="Move down"
                      onClick={() => move(project, 1)}
                      base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
                      hover="background:var(--ink-100);color:var(--fg-1)"
                      style={index === ordered.length - 1 || busy ? { opacity: 0.35, pointerEvents: "none" } : undefined}
                    >
                      <Ico name="chevron-down" size={15} />
                    </Ix>
                    <Ix
                      aria-label="Edit"
                      onClick={() => openEdit(project)}
                      base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
                      hover="background:var(--ink-100);color:var(--fg-1)"
                    >
                      <Ico name="pencil" size={15} />
                    </Ix>
                    <Ix
                      aria-label="Delete"
                      onClick={() => removeProject(project)}
                      base="width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:var(--fg-2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer"
                      hover="background:#FEE4E2;color:#B42318"
                      style={busy ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                    >
                      <Ico name="trash-2" size={15} />
                    </Ix>
                  </div>
                </div>

                <Divider />

                <div style={css("display:flex;align-items:center;gap:10px;margin-top:16px;flex-wrap:wrap")}>
                  {project.media.map((m) => (
                    <div key={m.id} style={css("position:relative;width:72px;height:72px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0")}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() => removePhoto(project, m.id)}
                        style={css("position:absolute;top:4px;right:4px;width:20px;height:20px;border:0;border-radius:50%;background:rgba(10,10,11,.64);color:var(--white);display:inline-flex;align-items:center;justify-content:center;cursor:pointer")}
                      >
                        <Ico name="x" size={11} />
                      </button>
                    </div>
                  ))}

                  {project.media.length < 6 ? (
                    <>
                      <input
                        ref={(el) => {
                          fileInputs.current[project.id] = el
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          e.target.value = ""
                          if (file) void uploadPhoto(project, file)
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputs.current[project.id]?.click()}
                        disabled={busy}
                        style={css("width:72px;height:72px;border:1px dashed var(--border-default);border-radius:var(--radius-md);background:transparent;color:var(--fg-3);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0")}
                      >
                        {busy ? (
                          <span style={css(`width:16px;height:16px;border-radius:50%;border:1.5px solid var(--ink-200);border-top-color:${G};animation:qhSpin 900ms linear infinite`)} />
                        ) : (
                          <Ico name="upload" size={18} />
                        )}
                      </button>
                    </>
                  ) : null}
                </div>

                {rowError[project.id] ? <p style={css("margin:10px 0 0;color:#B42318;font:var(--text-small)")}>{rowError[project.id]}</p> : null}
              </div>
            )
          })}
        </div>
      )}

      {modal ? (
        <Modal label={modal.kind === "edit" ? "Edit project" : "Add project"} maxWidth={520}>
          <ModalHeader eyebrow={modal.kind === "edit" ? "Edit project" : "Add project"} onClose={() => setModal(null)} />
          <div style={css("padding:20px;display:flex;flex-direction:column;gap:16px;overflow:auto")}>
            <Field label="Title" value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} placeholder="e.g. Kitchen rewiring" />
            <Field label="Category" value={draft.category} onChange={(v) => setDraft((d) => ({ ...d, category: v }))} placeholder="e.g. Electrical" />
            <Field label="Skills (comma separated)" value={draft.skills} onChange={(v) => setDraft((d) => ({ ...d, skills: v }))} placeholder="e.g. Wiring, Fault-finding" />
            <Field label="Description" value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} multiline rows={4} placeholder="What did the work involve?" />
            <Field label="Link (optional)" value={draft.projectUrl} onChange={(v) => setDraft((d) => ({ ...d, projectUrl: v }))} placeholder="https://" />
            {modalError ? <p style={css("margin:0;color:#B42318;font:var(--text-small)")}>{modalError}</p> : null}
          </div>
          <div style={css("display:flex;justify-content:flex-end;gap:12px;padding:16px 20px;border-top:1px solid var(--border-hairline)")}>
            <Ix
              onClick={() => setModal(null)}
              base="height:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:500 14px/1 var(--font-sans);cursor:pointer"
              hover="background:var(--ink-100)"
            >
              Cancel
            </Ix>
            <Ix
              onClick={saveDraft}
              base={`height:44px;padding:0 20px;border:0;border-radius:999px;background:${G};color:var(--white);font:500 14px/1 var(--font-sans);cursor:pointer`}
              hover="opacity:.92"
              style={saving ? { opacity: 0.7, pointerEvents: "none" } : undefined}
            >
              {saving ? "Saving…" : "Save"}
            </Ix>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
