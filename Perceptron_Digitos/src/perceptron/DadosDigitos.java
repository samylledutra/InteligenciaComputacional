/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package perceptron;

/**
 *
 * @author Samylle
 */

public class DadosDigitos {

    // Entradas: 10 exemplos, 16 bits (1 bias + 15 pixels)
    // Bias = 1 na posição 0
    public static double[][] entradas = {
        {1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1},
        {1,0,1,0,1,1,0,0,1,0,0,1,0,1,1,1},
        {1,1,1,0,0,1,0,0,1,1,1,0,1,0,0,1},
        {1,1,1,0,0,1,0,1,1,0,0,1,1,1,1,1},
        {1,0,1,1,0,1,1,1,1,0,0,1,0,0,1,0},
        {1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1},
        {1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,1},
        {1,1,1,0,0,1,0,1,0,0,1,0,0,1,0,0},
        {1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1},
        {1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1}
    };

    // Saídas desejadas (10 neurônios, saída 1 para o dígito correto, -1 para os outros)
    public static double[][] saidasDesejadas = {
        {1, -1, -1, -1, -1, -1, -1, -1, -1, -1},
        {-1, 1, -1, -1, -1, -1, -1, -1, -1, -1},
        {-1, -1, 1, -1, -1, -1, -1, -1, -1, -1},
        {-1, -1, -1, 1, -1, -1, -1, -1, -1, -1},
        {-1, -1, -1, -1, 1, -1, -1, -1, -1, -1},
        {-1, -1, -1, -1, -1, 1, -1, -1, -1, -1},
        {-1, -1, -1, -1, -1, -1, 1, -1, -1, -1},
        {-1, -1, -1, -1, -1, -1, -1, 1, -1, -1},
        {-1, -1, -1, -1, -1, -1, -1, -1, 1, -1},
        {-1, -1, -1, -1, -1, -1, -1, -1, -1, 1}
    };
}
