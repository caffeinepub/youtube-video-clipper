import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Archive,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Key,
  Lock,
  Plus,
  QrCode,
  RefreshCw,
  Scan,
  Shield,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

function SectionCard({
  title,
  icon,
  children,
}: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TwoFASection() {
  const [enabled, setEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [code, setCode] = useState("");

  return (
    <SectionCard
      title="Two-Factor Authentication"
      icon={<Key className="w-3.5 h-3.5 text-green-400" />}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white">
            {enabled ? "2FA is active" : "2FA is disabled"}
          </p>
          <p className="text-xs text-muted-foreground">
            {enabled
              ? "Your account is protected"
              : "Enable for extra security"}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(v) => {
            setEnabled(v);
            if (v) setShowQR(true);
            else toast.success("2FA disabled");
          }}
          data-ocid="security.2fa.switch"
        />
      </div>

      {enabled && (
        <div className="space-y-3">
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8"
            onClick={() => setShowQR(!showQR)}
            data-ocid="security.2fa.button"
          >
            <QrCode className="w-3.5 h-3.5 mr-1.5" />
            {showQR ? "Hide" : "Setup Authenticator"}
          </Button>

          {showQR && (
            <div className="space-y-3">
              {/* Mock QR */}
              <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center mx-auto">
                <div className="w-28 h-28 grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 49 }, (_, i) => i).map((cellIdx) => (
                    <div
                      key={cellIdx}
                      className={`rounded-sm ${Math.random() > 0.45 ? "bg-black" : "bg-white"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan with Google Authenticator or Authy
              </p>
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8 font-mono"
                  maxLength={6}
                  data-ocid="security.2fa.input"
                />
                <Button
                  size="sm"
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 text-xs h-8 px-3"
                  onClick={() => {
                    if (code.length === 6) {
                      toast.success("2FA verified and enabled!");
                      setShowQR(false);
                    } else {
                      toast.error("Enter a 6-digit code");
                    }
                  }}
                  data-ocid="security.2fa.confirm_button"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

function GDPRSection() {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Create a mock JSON blob download
      const data = {
        user: {
          name: "Beast Creator",
          principal: "2vxsx-fae",
          joinDate: "2025-01-15",
        },
        clips: [
          { id: "clip001", title: "My First Clip", createdAt: "2025-01-20" },
        ],
        messages: [],
        settings: { theme: "dark", notifications: true },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "beastclipping-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Your data has been downloaded!");
    }, 2000);
  };

  return (
    <SectionCard
      title="GDPR Data Export"
      icon={<Download className="w-3.5 h-3.5 text-blue-400" />}
    >
      <p className="text-xs text-muted-foreground">
        Download a complete export of all your personal data stored on Beast
        Clipping, including clips, messages, and settings.
      </p>
      <Button
        size="sm"
        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-sm h-9"
        onClick={handleExport}
        disabled={exporting}
        data-ocid="security.gdpr.button"
      >
        {exporting ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Preparing
            export…
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 mr-2" /> Download My Data (JSON)
          </>
        )}
      </Button>
    </SectionCard>
  );
}

function SecurityToggles() {
  const [watermarkProt, setWatermarkProt] = useState(false);
  const [secureSharing, setSecureSharing] = useState(false);
  const [autoArchive, setAutoArchive] = useState(false);
  const [archiveDays, setArchiveDays] = useState("90");

  return (
    <SectionCard
      title="Security Options"
      icon={<Shield className="w-3.5 h-3.5 text-primary" />}
    >
      <div className="space-y-4">
        {/* Watermark Protection */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Watermark Protection</p>
            <p className="text-xs text-muted-foreground">
              Prevent theft of un-rendered drafts
            </p>
          </div>
          <Switch
            checked={watermarkProt}
            onCheckedChange={(v) => {
              setWatermarkProt(v);
              toast.success(
                v ? "Watermark protection ON" : "Watermark protection OFF",
              );
            }}
            data-ocid="security.watermark.switch"
          />
        </div>

        {/* Secure Sharing */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Secure Sharing</p>
            <p className="text-xs text-muted-foreground">
              Password-protect video preview links per-clip
            </p>
          </div>
          <Switch
            checked={secureSharing}
            onCheckedChange={(v) => {
              setSecureSharing(v);
              toast.success(
                v ? "Secure sharing enabled" : "Secure sharing OFF",
              );
            }}
            data-ocid="security.secure_sharing.switch"
          />
        </div>

        {/* Auto-Archive */}
        <div className="space-y-2 border-t border-white/8 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Auto-Archive</p>
              <p className="text-xs text-muted-foreground">
                Move old clips to cold storage
              </p>
            </div>
            <Switch
              checked={autoArchive}
              onCheckedChange={(v) => {
                setAutoArchive(v);
                toast.success(v ? "Auto-archive enabled" : "Auto-archive OFF");
              }}
              data-ocid="security.archive.switch"
            />
          </div>
          {autoArchive && (
            <div className="flex items-center gap-2 pl-0">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Archive clips older than
              </Label>
              <select
                value={archiveDays}
                onChange={(e) => setArchiveDays(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none"
                data-ocid="security.archive.select"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function IPWhitelistSection() {
  const [ips, setIps] = useState(["192.168.1.100"]);
  const [newIp, setNewIp] = useState("");

  return (
    <SectionCard
      title="IP Whitelisting"
      icon={<Globe className="w-3.5 h-3.5 text-purple-400" />}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
          Enterprise Only
        </Badge>
      </div>
      <div className="space-y-2">
        {ips.map((ip, i) => (
          <div
            key={ip}
            className="flex items-center gap-2 py-1.5 px-2 bg-white/5 rounded-lg border border-white/8"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            <span className="text-xs text-white font-mono flex-1">{ip}</span>
            <button
              type="button"
              onClick={() => {
                setIps(ips.filter((_, j) => j !== i));
                toast.success("IP removed");
              }}
              className="text-red-400 hover:text-red-300"
              data-ocid="security.ip.delete_button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="192.168.x.x"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground text-xs h-8 font-mono"
            data-ocid="security.ip.input"
          />
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-8 px-3"
            onClick={() => {
              if (newIp.trim()) {
                setIps([...ips, newIp.trim()]);
                setNewIp("");
                toast.success("IP added to whitelist");
              }
            }}
            data-ocid="security.ip.button"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function ContentRightsSection() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");

  return (
    <SectionCard
      title="Content Rights Checker"
      icon={<Scan className="w-3.5 h-3.5 text-yellow-400" />}
    >
      <p className="text-xs text-muted-foreground">
        AI scans your clips for copyrighted music or footage before publishing.
      </p>
      {result && (
        <div
          className={`p-2.5 rounded-lg border text-xs ${
            result.includes("clear")
              ? "bg-green-500/10 border-green-500/20 text-green-300"
              : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"
          }`}
        >
          {result}
        </div>
      )}
      <Button
        size="sm"
        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 text-xs h-8"
        disabled={scanning}
        onClick={() => {
          setScanning(true);
          setResult("");
          setTimeout(() => {
            setScanning(false);
            setResult("All clear! No copyright issues detected.");
          }, 2000);
        }}
        data-ocid="security.rights.button"
      >
        {scanning ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Scanning…
          </>
        ) : (
          <>
            <Scan className="w-3.5 h-3.5 mr-1.5" /> Scan for Copyright…
          </>
        )}
      </Button>
    </SectionCard>
  );
}

function TrashBinSection() {
  const [deleted, setDeleted] = useState([
    {
      id: 1,
      title: "Old Intro Clip",
      deletedAt: "3 days ago",
      expires: "27 days left",
    },
    {
      id: 2,
      title: "Test Recording",
      deletedAt: "8 days ago",
      expires: "22 days left",
    },
    {
      id: 3,
      title: "Unused Gaming Clip",
      deletedAt: "15 days ago",
      expires: "15 days left",
    },
  ]);

  return (
    <SectionCard
      title="Trash Bin (30-day Recovery)"
      icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
    >
      {deleted.length === 0 ? (
        <div
          className="text-center py-6"
          data-ocid="security.trash.empty_state"
        >
          <Trash2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Trash bin is empty</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deleted.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/8"
              data-ocid={`security.trash.item.${item.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Deleted {item.deletedAt}
                  </span>
                  <span className="text-[10px] text-yellow-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {item.expires}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-green-400 hover:bg-green-500/10 h-7 px-2"
                  onClick={() => {
                    setDeleted(deleted.filter((d) => d.id !== item.id));
                    toast.success(`"${item.title}" restored!`);
                  }}
                  data-ocid="security.trash.button"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Restore
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-red-400 hover:bg-red-500/10 h-7 px-2"
                  onClick={() => {
                    setDeleted(deleted.filter((d) => d.id !== item.id));
                    toast.success("Permanently deleted");
                  }}
                  data-ocid="security.trash.delete_button"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default function SecuritySettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h2 className="text-white font-bold text-base">Security & Privacy</h2>
      </div>
      <div className="space-y-3">
        <TwoFASection />
        <GDPRSection />
        <SecurityToggles />
        <IPWhitelistSection />
        <ContentRightsSection />
        <TrashBinSection />
      </div>
    </div>
  );
}
