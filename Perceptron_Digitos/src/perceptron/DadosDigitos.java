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
