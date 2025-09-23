import math
import argparse
# python3 -m venv venv
# source venv/bin/activate
# pip install matplotlib
import matplotlib.pyplot as plt
import subprocess
import os

def compute(N):
    # max faulty nodes tolerated (attacker can control > this to break protocol)
    pw_max_faulty = (N - 1) // 2            # PoW: attacker needs >50% (node model is approximate)
    bft_max_faulty = (N - 1) // 3           # PBFT/HotStuff/Tendermint: up to f in 3f+1
    poa_max_faulty = (N - 1) // 2           # PoA: requires majority of authorities
    return {
        "PoW (power approx.)": pw_max_faulty,
        "PBFT/HotStuff (BFT)": bft_max_faulty,
        "PoS (BFT variant)": bft_max_faulty,
        "PoA (Authority)": poa_max_faulty,
    }

def make_chart(N, outpath):
    vals = compute(N)
    protocols = list(vals.keys())
    max_faulty = [vals[p] for p in protocols]
    min_honest = [N - f for f in max_faulty]
    frac_honest = [h / N for h in min_honest]

    fig, ax = plt.subplots(figsize=(9,5))
    bars = ax.bar(protocols, [f*100 for f in frac_honest], color=['#2b8cbe','#7bccc4','#a6bddb','#fdbb84'])
    ax.set_ylim(0,100)
    ax.set_ylabel("Minimum Honest % required")
    ax.set_title(f"Consensus fault thresholds (N={N})")

    # annotate bars with absolute values
    for bar, h, f in zip(bars, min_honest, max_faulty):
        ax.annotate(f"{h}/{N} honest\n(max faulty={f})",
                    xy=(bar.get_x() + bar.get_width() / 2, bar.get_height()),
                    xytext=(0,8), textcoords="offset points",
                    ha='center', va='bottom', fontsize=9)

    plt.tight_layout()
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    plt.savefig(outpath, dpi=150)
    plt.close(fig)
    return outpath

def open_image(path):
    # macOS: open with Preview.app
    try:
        subprocess.run(["open", path], check=True)
    except Exception as e:
        print("Could not open image automatically:", e)

def main():
    p = argparse.ArgumentParser(description="Visualize consensus fault thresholds and computed values")
    p.add_argument("--nodes", "-n", type=int, default=108, help="Number of validators/nodes (default 108)")
    p.add_argument("--out", "-o", default="/tmp/consensus_comparison.png", help="Output PNG path")
    p.add_argument("--no-open", action="store_true", help="Don't auto-open the PNG")
    args = p.parse_args()

    out = make_chart(args.nodes, args.out)
    print(f"Saved image to {out}")
    if not args.no_open:
        open_image(out)

if __name__ == "__main__":
    main()