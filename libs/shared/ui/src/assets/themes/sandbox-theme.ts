import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Sandbox preset — PrimeNG v21 + Tailwind v4.
 *
 * KEY RULE: the `surface` ramp runs in the SAME direction in both color
 * schemes — 0 is lightest, 950 is darkest. Aura's dark tokens are authored
 * against that convention (formField.background -> {surface.950},
 * content.background -> {surface.900}, borders -> {surface.700}).
 * Inverting the dark ramp makes every token you did NOT hand-patch resolve
 * to a light value. Which surface is "the canvas" is decided by the semantic
 * tokens below, not by flipping the ramp.
 */
export const SandboxPreset = definePreset(Aura, {
  primitive: {
    // --- Brand blue (primary) --------------------------------------------
    // 400 #6FB1FC and 600 #0052D4 are your brand anchors; 500 #4364F7 is the
    // mid used for primary in light mode.
    cyan: {
      50: '#f0f7ff',
      100: '#e0effe',
      200: '#bae0fd',
      300: '#7cc7fb',
      400: '#6FB1FC',
      500: '#4364F7',
      600: '#0052D4',
      700: '#0043b3',
      800: '#003791',
      900: '#002f7a',
      950: '#001a47',
    },

    // --- Brand accent (vermilion) ----------------------------------------
    // Rebuilt as a real single-hue ramp anchored on #FF4B2B. Your original
    // 400 (#FF416C) was pink and 500 (#FF4B2B) red-orange — two different
    // hues inside one scale, which bands badly in gradients and makes
    // hover/active states shift hue instead of value.
    orange: {
      50: '#fff4f1',
      100: '#ffe4dc',
      200: '#ffc7b8',
      300: '#ffa288',
      400: '#ff7550',
      500: '#FF4B2B',
      600: '#ed2f0f',
      700: '#c4200a',
      800: '#9c1c0d',
      900: '#7e1c11',
      950: '#450a04',
    },

    // --- Neutral ramp -----------------------------------------------------
    // Lightest -> darkest. 700-950 are your custom dark-UI hues.
    slate: {
      0: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#2a3142', // border / stroke (dark)
      800: '#1e2430', // elevated card (dark)
      900: '#1b1f29', // panel base (dark)
      950: '#12151d', // ground canvas (dark)
    },
  },

  semantic: {
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}',
    },

    transitionDuration: '0.2s',
    disabledOpacity: '0.5',
    iconSize: '1rem',
    anchorGutter: '2px',

    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },

    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      sm: { fontSize: '0.875rem', paddingX: '0.625rem', paddingY: '0.375rem' },
      lg: { fontSize: '1.125rem', paddingX: '0.875rem', paddingY: '0.625rem' },
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },

    list: {
      padding: '0.25rem 0.25rem',
      gap: '2px',
      header: { padding: '0.5rem 1rem 0.25rem 1rem' },
      option: { padding: '0.5rem 0.75rem', borderRadius: '{border.radius.sm}' },
      optionGroup: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600',
      },
    },

    content: {
      borderRadius: '{border.radius.md}',
    },

    mask: {
      transitionDuration: '0.15s',
    },

    navigation: {
      list: { padding: '0.25rem 0.25rem', gap: '2px' },
      item: {
        padding: '0.5rem 0.75rem',
        borderRadius: '{border.radius.sm}',
        gap: '0.5rem',
      },
      submenuLabel: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600',
      },
      submenuIcon: { size: '0.875rem' },
    },

    overlay: {
      select: {
        borderRadius: '{border.radius.md}',
        shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      },
      popover: {
        borderRadius: '{border.radius.md}',
        padding: '0.75rem',
        shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      },
      modal: {
        borderRadius: '{border.radius.xl}',
        padding: '1.25rem',
        shadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      navigation: {
        shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      },
    },

    colorScheme: {
      // ===================================================================
      // LIGHT
      // ===================================================================
      light: {
        surface: {
          0: '{slate.0}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },

        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },

        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },

        mask: {
          background: 'rgba(18, 21, 29, 0.4)',
          color: '{surface.200}',
        },

        text: {
          color: '{surface.700}',
          hoverColor: '{surface.800}',
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },

        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },

        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          filledHoverBackground: '{surface.100}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{surface.700}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          invalidPlaceholderColor: '{red.600}',
          floatLabelColor: '{surface.500}',
          floatLabelFocusColor: '{primary.600}',
          floatLabelActiveColor: '{surface.500}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          iconColor: '{surface.400}',
          shadow: '0 1px 2px 0 rgba(18, 21, 29, 0.05)',
        },

        overlay: {
          select: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
        },

        list: {
          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
            },
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
        },

        navigation: {
          item: {
            focusBackground: '{surface.100}',
            activeBackground: '{surface.100}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
          submenuIcon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}',
          },
        },
      },

      // ===================================================================
      // DARK  — same ramp direction, dark end selected by the tokens
      // ===================================================================
      dark: {
        surface: {
          0: '{slate.0}', //  #ffffff  -> highest-contrast text
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}', //  muted text
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}', //  #2a3142  borders
          800: '{slate.800}', //  #1e2430  elevated / hover
          900: '{slate.900}', //  #1b1f29  panel base
          950: '{slate.950}', //  #12151d  ground canvas
        },

        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },

        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.87)',
        },

        mask: {
          background: 'rgba(8, 10, 15, 0.6)',
          color: '{surface.200}',
        },

        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.400}',
          hoverMutedColor: '{surface.300}',
        },

        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.800}',
          borderColor: '{surface.700}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },

        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.700}',
          filledBackground: '{surface.800}',
          filledHoverBackground: '{surface.700}',
          filledFocusBackground: '{surface.800}',
          borderColor: '{surface.700}',
          hoverBorderColor: '{surface.600}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{surface.0}',
          disabledColor: '{surface.400}',
          placeholderColor: '{surface.400}',
          invalidPlaceholderColor: '{red.400}',
          floatLabelColor: '{surface.400}',
          floatLabelFocusColor: '{primary.color}',
          floatLabelActiveColor: '{surface.400}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          iconColor: '{surface.400}',
          shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        },

        overlay: {
          select: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
        },

        list: {
          option: {
            focusBackground: '{surface.800}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
            },
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
        },

        navigation: {
          item: {
            focusBackground: '{surface.800}',
            activeBackground: '{surface.800}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
              activeColor: '{surface.400}',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}',
          },
          submenuIcon: {
            color: '{surface.500}',
            focusColor: '{surface.400}',
            activeColor: '{surface.400}',
          },
        },
      },
    },
  },

  components: {
    /**
     * Only two overrides survive. Everything you previously patched by hand
     * (inputtext, selectbutton.invalidBorderColor) is now correct from the
     * semantic layer — delete those.
     */

    // Cards sit ABOVE the panel background, so they get surface.800 in dark
    // rather than the default content.background (surface.900).
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            color: '{text.color}',
          },
          subtitle: { color: '{text.muted.color}' },
        },
        dark: {
          root: {
            background: '{surface.800}',
            color: '{text.color}',
          },
          subtitle: { color: '{text.muted.color}' },
        },
      },
      root: {
        borderRadius: '{border.radius.xl}',
        shadow: 'none',
      },
      body: { padding: '1.25rem', gap: '0.5rem' },
    },

    // Same reasoning for anything that renders as a raised sheet on the canvas.
    panel: {
      colorScheme: {
        dark: {
          header: { background: '{surface.800}' },
        },
      },
    },
  },

  /**
   * Custom tokens — emitted as --p-accent-*, --p-brand-*.
   * Use in CSS: `background: var(--p-accent-color)`.
   * Use in Tailwind v4 arbitrary values: `bg-[var(--p-accent-color)]`.
   */
  extend: {
    brand: {
      gradient: {
        blueFrom: '#6FB1FC',
        blueTo: '#0052D4',
        accentFrom: '#FF416C',
        accentTo: '#FF4B2B',
      },
    },
    colorScheme: {
      light: {
        accent: {
          color: '{orange.500}',
          contrastColor: '#ffffff',
          hoverColor: '{orange.600}',
          activeColor: '{orange.700}',
          subtleBackground: '{orange.50}',
          subtleColor: '{orange.700}',
        },
      },
      dark: {
        accent: {
          color: '{orange.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{orange.300}',
          activeColor: '{orange.200}',
          subtleBackground: 'color-mix(in srgb, {orange.400}, transparent 85%)',
          subtleColor: '{orange.300}',
        },
      },
    },
  },
});

export const SandboxPreset_v0 = definePreset(Aura, {
  primitive: {
    // 1. Define your raw primitive palette values
    cyan: {
      50: '#f0f7ff',
      100: '#e0effe',
      200: '#bae0fd',
      300: '#7cc7fb',
      400: '#6FB1FC',
      500: '#4364F7', // Main Brand Color
      600: '#0052D4',
      700: '#0043b3',
      800: '#003791',
      900: '#002f7a',
      950: '#001a47',
    },
  },
  semantic: {
    // 2. Map the semantic `primary` token to your primitive palette
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}',
    },
  },
});
