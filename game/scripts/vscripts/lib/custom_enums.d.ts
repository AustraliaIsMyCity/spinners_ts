declare const enum AttachLocation {
    HITLOC = "attach_hitloc",
    EYES = "attach_eyes",
    WEAPON = "attach_weapon",
    HEAD = "attach_head",
    SWORD_END = "attach_sword_end",
    ATTACK1 = "attach_attack1",
    EMPTY = "",
}

declare const enum WeaponElement {
    NONE = 0,
    FIRE = 1,
    FROST = 2,
    WIND = 4,
    EARTH = 8,
    ELECTRICITY = 16,
    WATER = 32,
    CHAOS = 64,
    ORDER = 128,
}

type WeaponID = number;