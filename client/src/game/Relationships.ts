interface IRelationships {
  hostiles?: { [sideId: string]: string[] };
  allies?: { [sideId: string]: string[] };
}

export default class Relationships {
  hostiles: { [sideId: string]: string[] };
  allies: { [sideId: string]: string[] };

  constructor(parameters: IRelationships) {
    this.hostiles = parameters.hostiles ?? {};
    this.allies = parameters.allies ?? {};
  }

  addHostile(sideId: string, hostileId: string) {
    if (!this.hostiles[sideId]) {
      this.hostiles[sideId] = [];
    }
    if (!this.hostiles[sideId].includes(hostileId)) {
      this.hostiles[sideId].push(hostileId);
    }
    this.removeAlly(sideId, hostileId);
  }

  removeHostile(sideId: string, hostileId: string) {
    if (this.hostiles[sideId]) {
      this.hostiles[sideId] = this.hostiles[sideId].filter(
        (id) => id !== hostileId
      );
    }
  }

  addAlly(sideId: string, allyId: string) {
    if (!this.allies[sideId]) {
      this.allies[sideId] = [];
    }
    if (!this.allies[sideId].includes(allyId)) {
      this.allies[sideId].push(allyId);
    }
    this.removeHostile(sideId, allyId);
  }

  removeAlly(sideId: string, allyId: string) {
    if (this.allies[sideId]) {
      this.allies[sideId] = this.allies[sideId].filter((id) => id !== allyId);
    }
  }

  isAlly(sideId: string, allyId: string): boolean {
    return this.allies[sideId]?.includes(allyId) ?? false;
  }

  isHostile(sideId: string, hostileId: string): boolean {
    return this.hostiles[sideId]?.includes(hostileId) ?? false;
  }

  getAllies(sideId: string): string[] {
    return this.allies[sideId] ?? [];
  }

  getHostiles(sideId: string): string[] {
    return this.hostiles[sideId] ?? [];
  }

  updateRelationship(sideId: string, hostiles: string[], allies: string[]) {
    this.hostiles[sideId] = hostiles;
    this.allies[sideId] = allies;
  }

  deleteSide(sideId: string) {
    Object.keys(this.hostiles).forEach((key) => {
      this.hostiles[key] = this.hostiles[key].filter((id) => id !== sideId);
    });
    Object.keys(this.allies).forEach((key) => {
      this.allies[key] = this.allies[key].filter((id) => id !== sideId);
    });
    delete this.hostiles[sideId];
    delete this.allies[sideId];
  }
}
